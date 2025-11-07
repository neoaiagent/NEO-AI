
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Download, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useHistory } from '@/contexts/HistoryContext';

const ToolWorkspace = ({ tool, onBack, historyItem }) => {
  const { toast } = useToast();
  const { addHistoryItem } = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [result, setResult] = useState(null);
  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState(null);
  const [inputFileUrl, setInputFileUrl] = useState(null);

  useEffect(() => {
    const beforeUnloadHandler = (event) => {
      if (isLoading || isProcessing) {
        event.preventDefault();
        event.returnValue = 'A generation process is currently running. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, [isLoading, isProcessing]);

  useEffect(() => {
    if (historyItem) {
        setInputs(historyItem.inputs || {});
        setResult(historyItem.result);
        setInputFileUrl(historyItem.inputFileUrl || null);
        setIsLoading(false);
    } else {
        const defaultInputs = {};
        if (tool.id === 'image-to-video') {
            defaultInputs.model_AI = 'bytedance';
            defaultInputs.durasi = '5';
            defaultInputs.resolusi = '720p';
            defaultInputs.prompt = '';
        } else if (tool.id === 'brief-to-images') {
            defaultInputs.prompt = '';
            defaultInputs.AR = '1:1';
        }
        setInputs(defaultInputs);
        setFile(null);
        setInputFileUrl(null);
        setResult(null);
    }
  }, [tool, historyItem]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
        setInputFileUrl(URL.createObjectURL(selectedFile));
    } else {
        setInputFileUrl(null);
    }
  };

  // PING check function to verify backend connectivity
  const pingBackend = async (webhookUrl) => {
    try {
      // For n8n webhooks, try a lightweight OPTIONS request first (CORS preflight)
      // This helps verify connectivity without triggering the actual webhook
      const response = await fetch(webhookUrl, {
        method: 'OPTIONS',
        mode: 'cors',
        headers: {
          'Accept': '*/*',
          'Origin': window.location.origin,
        },
      });
      // OPTIONS request success or any response means backend is reachable
      return true;
    } catch (error) {
      // If OPTIONS fails, try a minimal GET request to a ping endpoint pattern
      try {
        // Try common ping endpoint patterns
        const pingPatterns = [
          webhookUrl.replace('/webhook/', '/ping/'),
          webhookUrl.replace('/webhook/', '/health/'),
          webhookUrl + '/ping',
          webhookUrl + '/health',
        ];
        
        for (const pingUrl of pingPatterns) {
          try {
            const response = await fetch(pingUrl, {
              method: 'GET',
              mode: 'cors',
              headers: {
                'Accept': '*/*',
              },
            });
            if (response.ok) return true;
          } catch (e) {
            continue; // Try next pattern
          }
        }
        
        // If all ping attempts fail, proceed anyway (backend might not have ping endpoint)
        console.warn('PING check failed, proceeding anyway. Backend may not have a ping endpoint.');
        return true;
      } catch (e) {
        console.warn('PING check failed, proceeding anyway:', e);
        return true; // Proceed anyway if ping fails
      }
    }
  };

  // Poll for processing status (for text-to-speech)
  const pollProcessingStatus = async (jobId, maxAttempts = 60) => {
    let attempts = 0;
    const pollInterval = 2000; // 2 seconds

    const poll = async () => {
      if (attempts >= maxAttempts) {
        throw new Error('Processing timeout - maximum polling attempts reached');
      }

      try {
        const statusUrl = tool.webhook.replace('/webhook/', '/status/') + `?jobId=${jobId}`;
        const response = await fetch(statusUrl, {
          method: 'GET',
          mode: 'cors',
          credentials: 'omit',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const statusData = await response.json();
          
          if (statusData.status === 'completed' && statusData.result) {
            return statusData.result;
          } else if (statusData.status === 'failed') {
            throw new Error(statusData.error || 'Processing failed');
          } else if (statusData.status === 'processing') {
            setProcessingStatus(statusData.message || `Processing... (${attempts + 1}/${maxAttempts})`);
            attempts++;
            await new Promise(resolve => setTimeout(resolve, pollInterval));
            return poll();
          } else {
            setProcessingStatus(statusData.message || `Status: ${statusData.status}`);
            attempts++;
            await new Promise(resolve => setTimeout(resolve, pollInterval));
            return poll();
          }
        } else {
          attempts++;
          await new Promise(resolve => setTimeout(resolve, pollInterval));
          return poll();
        }
      } catch (error) {
        if (attempts >= maxAttempts - 1) {
          throw error;
        }
        attempts++;
        await new Promise(resolve => setTimeout(resolve, pollInterval));
        return poll();
      }
    };

    return poll();
  };

  const handleGenerate = async () => {
    if (!tool.webhook) {
      toast({ title: 'Tool not configured', variant: 'destructive' });
      return;
    }
    
    setIsLoading(true);
    setIsProcessing(false);
    setProcessingStatus('');
    setResult(null);
    
    // PING check for text-to-speech tool
    if (tool.id === 'text-to-speech') {
      setProcessingStatus('Checking backend connection...');
      const isBackendAvailable = await pingBackend(tool.webhook);
      if (!isBackendAvailable) {
        toast({ 
          title: 'Backend Unavailable', 
          description: 'Unable to connect to the backend service. Please try again later.',
          variant: 'destructive' 
        });
        setIsLoading(false);
        return;
      }
    }

    const formData = new FormData();
    if (file) formData.append('image', file);
    for (const key in inputs) {
      if (inputs[key] !== null && inputs[key] !== undefined) {
        formData.append(key, inputs[key]);
      }
    }

    try {
      setProcessingStatus('Sending request...');
      
      // For text-to-speech, check if backend supports async processing
      const isTextToSpeech = tool.id === 'text-to-speech';
      
      const fetchOptions = {
        method: 'POST',
        body: formData,
        mode: 'cors',
        credentials: 'omit', // Don't send credentials to avoid CORS issues
        headers: {
          'Accept': '*/*',
        },
      };

      const response = await fetch(tool.webhook, fetchOptions);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const contentType = response.headers.get("content-type");
      let responseData;

      // Check if response indicates async processing (for text-to-speech)
      if (isTextToSpeech && contentType && contentType.includes("application/json")) {
        const jsonData = await response.json();
        
        // If backend returns a job ID, start polling
        if (jsonData.jobId || jsonData.status === 'processing') {
          setIsProcessing(true);
          setProcessingStatus('Processing your request...');
          
          try {
            // Poll for completion
            const finalResult = await pollProcessingStatus(jsonData.jobId || jsonData.id);
            responseData = finalResult;
          } catch (pollError) {
            throw new Error(`Processing failed: ${pollError.message}`);
          } finally {
            setIsProcessing(false);
            setProcessingStatus('');
          }
        } else {
          responseData = jsonData;
        }
      }
      // Handle JSON response
      else if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } 
      // Handle binary file response (e.g., video, image, audio)
      else {
        setProcessingStatus('Receiving file...');
        const blob = await response.blob();
        responseData = { blob: blob, url: URL.createObjectURL(blob), type: blob.type };
      }

      setResult(responseData);
      addHistoryItem({
        id: Date.now().toString(),
        toolName: tool.name,
        toolId: tool.id,
        date: new Date().toISOString(),
        status: 'Completed',
        inputs,
        result: responseData,
        inputFileUrl: tool.id === 'brief-to-images' ? responseData.url : inputFileUrl,
      });
      toast({ title: 'Generation Complete!' });

    } catch (error) {
      console.error("Error during generation:", error);
      const errorResult = { error: 'Generation Failed', message: error.message };
      setResult(errorResult);
      setIsProcessing(false);
      setProcessingStatus('');
      addHistoryItem({
        id: Date.now().toString(),
        toolName: tool.name,
        toolId: tool.id,
        date: new Date().toISOString(),
        status: 'Failed',
        inputs,
        result: errorResult,
        inputFileUrl: inputFileUrl,
      });
      toast({ title: 'Error', description: 'Generation failed. Check the output for details.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    
    // If the result is a blob, use its URL
    if (result.blob && result.url) {
      const link = document.createElement('a');
      link.href = result.url;
      const fileExtension = result.type ? result.type.split('/')[1] : 'dat';
      link.setAttribute('download', `neoai-result-${Date.now()}.${fileExtension}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // If the result is from JSON with a URL
    const urlToDownload = (result.data && result.data.video_url) || result.video_url || result.audio_url || result.image_url;
    if (urlToDownload && typeof urlToDownload === 'string') {
      const link = document.createElement('a');
      link.href = urlToDownload;
      link.setAttribute('download', '');
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
       toast({ title: 'No downloadable file', variant: 'destructive' });
    }
  };

  const handleClear = () => {
    onBack();
  };
  
  const renderInputs = () => {
    switch (tool.id) {
        case 'social-media-generator':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
              <input type="file" onChange={handleFileChange} className="input-field" accept="image/*" disabled={isLoading || historyItem}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image Prompt</label>
              <textarea name="image_prompt" value={inputs.image_prompt || ''} onChange={handleInputChange} rows={3} className="input-field" placeholder="e.g., a futuristic city skyline at sunset" disabled={isLoading || historyItem}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brief Narasi (Caption)</label>
              <textarea name="caption_prompt" value={inputs.caption_prompt || ''} onChange={handleInputChange} rows={3} className="input-field" placeholder="e.g., create a catchy caption about innovation" disabled={isLoading || historyItem}/>
            </div>
          </>
        );
      case 'text-to-speech':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brief Narasi</label>
            <textarea name="prompt" value={inputs.prompt || ''} onChange={handleInputChange} rows={5} className="input-field" placeholder="Type the text you want to convert to speech..." disabled={isLoading || historyItem}/>
          </div>
        );
      case 'image-to-video':
        return (
            <>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                    <input type="file" onChange={handleFileChange} className="input-field" accept="image/*" required disabled={isLoading || historyItem}/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prompt</label>
                    <textarea name="prompt" value={inputs.prompt || ''} onChange={handleInputChange} rows={3} className="input-field" placeholder="e.g., make the clouds move, zoom in slowly" required disabled={isLoading || historyItem}/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">AI Model</label>
                    <select name="model_AI" value={inputs.model_AI || 'bytedance'} onChange={handleInputChange} className="input-field" required disabled={isLoading || historyItem}>
                        <option value="pika_v2">pika v.2</option>
                        <option value="pika_v2_2">pika v.2.2</option>
                        <option value="kling">kling</option>
                        <option value="bytedance">bytedance</option>
                        <option value="wan_v2_5">wan v.2.5</option>
                    </select>
                </div>
                {inputs.model_AI !== 'kling' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Resolusi</label>
                        <select name="resolusi" value={inputs.resolusi || '720p'} onChange={handleInputChange} className="input-field" required disabled={isLoading || historyItem}>
                            <option value="720p">720p</option>
                            <option value="1080p">1080p</option>
                        </select>
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Durasi</label>
                    <select name="durasi" value={inputs.durasi || '5'} onChange={handleInputChange} className="input-field" required disabled={isLoading || historyItem}>
                        <option value="5">5 detik</option>
                        <option value="10">10 detik</option>
                    </select>
                </div>
            </>
        );
      case 'image-editing':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
              <input type="file" onChange={handleFileChange} className="input-field" accept="image/*" disabled={isLoading || historyItem}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Edit Prompt</label>
              <textarea name="image_prompt" value={inputs.image_prompt || ''} onChange={handleInputChange} rows={3} className="input-field" placeholder="e.g., make the sky blue, add a cat" disabled={isLoading || historyItem}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Aspect Ratio</label>
              <select name="aspect_ratio" value={inputs.aspect_ratio || '1:1'} onChange={handleInputChange} className="input-field" disabled={isLoading || historyItem}>
                <option value="1:1">1:1 (Square)</option>
                <option value="9:16">9:16 (Vertical)</option>
                <option value="16:9">16:9 (Widescreen)</option>
                <option value="4:3">4:3 (Standard)</option>
                <option value="3:4">3:4 (Portrait)</option>
              </select>
            </div>
          </>
        );
      case 'brief-to-images':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prompt</label>
              <textarea name="prompt" value={inputs.prompt || ''} onChange={handleInputChange} rows={5} className="input-field" placeholder="e.g., a stunning synthwave landscape with a retro car" disabled={isLoading || historyItem}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Aspect Ratio</label>
              <select name="AR" value={inputs.AR || '1:1'} onChange={handleInputChange} className="input-field" disabled={isLoading || historyItem}>
                <option value="1:1">1:1</option>
                <option value="16:9">16:9</option>
                <option value="9:16">9:16</option>
                <option value="3:4">3:4</option>
                <option value="4:3">4:3</option>
              </select>
            </div>
          </>
        );
      default:
        return <p className="text-sm text-gray-600">This tool is not yet configured.</p>;
    }
  };

  const renderOutput = () => {
    if (isLoading || isProcessing) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <Loader2 className="w-12 h-12 animate-spin text-[#0573AC]" />
          <p className="mt-4 text-lg">
            {isProcessing ? (processingStatus || 'Processing... Please wait.') : 'Generating... Please wait.'}
          </p>
          {isProcessing && processingStatus && (
            <p className="mt-2 text-sm text-gray-400">{processingStatus}</p>
          )}
        </div>
      );
    }
    if (!result) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">Generated output will appear here</p>
            </div>
          );
    }
    if (result.error) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-red-500 bg-red-50 rounded-lg p-4">
              <AlertTriangle className="w-12 h-12" />
              <h4 className="mt-4 text-lg font-semibold">{result.error}</h4>
              <p className="mt-2 text-sm text-red-700 text-center">{result.message}</p>
            </div>
          );
    }
    
    // Check for blob URL first, then check for URL from JSON
    const videoUrl = result.url && result.type?.startsWith('video/') ? result.url : (result.data && result.data.video_url) || result.video_url;
    if (videoUrl) {
        return <video controls src={videoUrl} className="w-full rounded-lg shadow-md" />;
    }

    const imageUrl = result.url && result.type?.startsWith('image/') ? result.url : result.image_url;
    if (imageUrl) {
        return <img src={imageUrl} alt="Generated output" className="rounded-lg shadow-md w-full" />;
    }

    const audioUrl = result.url && result.type?.startsWith('audio/') ? result.url : result.audio_url;
    if (audioUrl) {
        return <audio controls src={audioUrl} className="w-full" />;
    }

    return <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(result, null, 2)}</pre>;
  };

  return (
    <div className="p-6 space-y-6">
      <nav id="crumbs" className="breadcrumb">
        <button onClick={onBack} className="flex items-center gap-2 text-[#0573AC] hover:underline font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <span className="text-gray-400 mx-2">/</span>
        <span className="text-gray-600">Dashboard</span>
        <span className="text-gray-400 mx-2">›</span>
        <span className="font-medium text-[#013353]" data-id="tool-name">{tool?.name}</span>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        id="tool-layout"
        className="grid lg:grid-cols-5 gap-6"
      >
        <aside id="tool-inputs" className="lg:col-span-2 space-y-4">
          <div className="card">
            <h3 className="text-lg font-semibold text-[#013353] mb-4">Input Parameters</h3>
            <div className="space-y-4">{renderInputs()}</div>
          </div>
        </aside>

        <main id="tool-output" className="lg:col-span-3">
          <div className="card h-full min-h-[400px]">
            <h3 className="text-lg font-semibold text-[#013353] mb-4">Output</h3>
            {renderOutput()}
          </div>
        </main>
      </motion.div>

      <div id="tool-actions" className="sticky-actions">
        <button onClick={handleClear} className="btn-ghost flex items-center gap-2">
          <Trash2 className="w-4 h-4" /> Clear
        </button>
        <div className="flex gap-3">
          {result && !result.error && (
            <button onClick={handleDownload} className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" /> Download
            </button>
          )}
          {!historyItem && <button
            id="btn-generate"
            onClick={handleGenerate}
            disabled={isLoading}
            className="btn-primary flex items-center gap-2 min-w-[120px] justify-center"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Play className="w-4 h-4" /> Generate</>}
          </button>}
        </div>
      </div>
    </div>
  );
};

export default ToolWorkspace;
