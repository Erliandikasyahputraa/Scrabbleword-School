import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

// Initialize the PDF.js worker
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

interface PdfViewerProps {
  url: string;
  onComplete?: () => void;
}

export default function PdfViewer({ url, onComplete }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.2);
  const [isRendering, setIsRendering] = useState(false);
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        setNumPages(0);
        setPageNum(1);
        const token = localStorage.getItem('auth_token');
        const loadingTask = pdfjsLib.getDocument({ 
            url, 
            httpHeaders: token ? { 'Authorization': `Bearer ${token}` } : undefined 
        });
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setPageNum(1);
        if (pdf.numPages === 1 && onComplete) {
           onComplete();
        }
      } catch (error) {
        // Silent error
      }
    };

    loadPdf();
  }, [url]);

  useEffect(() => {
    let isActive = true;

    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current) return;
      if (isRendering && renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }

      setIsRendering(true);

      try {
        const page = await pdfDoc.getPage(pageNum);
        if (!isActive) return;

        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        const outputScale = window.devicePixelRatio || 1;

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height = Math.floor(viewport.height) + "px";

        const transform = outputScale !== 1 
          ? [outputScale, 0, 0, outputScale, 0, 0] 
          : undefined;

        const renderContext: any = {
          canvasContext: context,
          transform: transform,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;
        
        await renderTask.promise;
      } catch (error: any) {
        // Silent error
      } finally {
        if (isActive) {
          setIsRendering(false);
          renderTaskRef.current = null;
        }
      }
    };

    renderPage();

    return () => {
      isActive = false;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdfDoc, pageNum, scale]);

  const handlePageChange = (delta: number) => {
    const newPage = pageNum + delta;
    if (newPage >= 1 && newPage <= numPages) {
      setPageNum(newPage);
      if (newPage === numPages && onComplete) {
        onComplete();
      }
    }
  };

  const handleFitWidth = async () => {
      if (!pdfDoc || !containerRef.current) return;
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.0 });
      const containerWidth = containerRef.current.clientWidth - 40; // padding
      setScale(containerWidth / viewport.width);
  };

  const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
          containerRef.current?.requestFullscreen().catch(() => {
              // Silent error
          });
      } else {
          document.exitFullscreen();
      }
  };

  useEffect(() => {
      const handleFullscreenChange = () => {
          setIsFullscreen(!!document.fullscreenElement);
      };
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div ref={containerRef} className={`flex flex-col items-center w-full mx-auto bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-all ${isFullscreen ? 'h-screen p-8' : 'max-w-4xl p-4 shadow-inner'}`}>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm w-full justify-between mb-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <button
            disabled={pageNum <= 1 || isRendering}
            onClick={() => handlePageChange(-1)}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md disabled:opacity-50 transition-colors"
          >
            <ChevronLeft size={20} className="text-slate-700 dark:text-slate-300" />
          </button>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Page {pageNum} of {numPages || '--'}
          </span>
          <button
            disabled={pageNum >= numPages || isRendering}
            onClick={() => handlePageChange(1)}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md disabled:opacity-50 transition-colors"
          >
            <ChevronRight size={20} className="text-slate-700 dark:text-slate-300" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale(prev => Math.max(0.5, prev - 0.2))}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={20} className="text-slate-700 dark:text-slate-300" />
          </button>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale(prev => Math.min(3.0, prev + 0.2))}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={20} className="text-slate-700 dark:text-slate-300" />
          </button>
          <button
            onClick={handleFitWidth}
            className="p-2 px-3 text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md transition-colors text-slate-700 dark:text-slate-300"
            title="Fit Width"
          >
            Fit Width
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 px-3 text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md transition-colors text-slate-700 dark:text-slate-300"
            title="Fullscreen"
          >
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
        </div>
      </div>

      {/* PDF Canvas Container */}
      <div className={`overflow-auto w-full border border-slate-200 dark:border-slate-700 bg-slate-300 dark:bg-slate-950 flex justify-center p-4 rounded-lg shadow-inner ${isFullscreen ? 'h-[calc(100vh-120px)]' : 'h-[600px]'}`}>
        {!pdfDoc && (
          <div className="flex items-center justify-center h-full">
            <span className="text-slate-500 flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
              Loading PDF...
            </span>
          </div>
        )}
        <canvas 
          ref={canvasRef} 
          className="max-w-none shadow-md bg-white transition-all duration-200"
        />
      </div>
    </div>
  );
}
