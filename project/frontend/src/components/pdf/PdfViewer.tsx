import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

// Initialize the PDF.js worker
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

interface PdfViewerProps {
  url: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.2);
  const [isRendering, setIsRendering] = useState(false);
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({ url });
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setPageNum(1);
      } catch (error) {
        console.error('Error loading PDF:', error);
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

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext: any = {
          canvasContext: context,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;
        
        await renderTask.promise;
      } catch (error: any) {
        if (error.name !== 'RenderingCancelledException') {
          console.error('Error rendering page:', error);
        }
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

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto bg-slate-50 dark:bg-slate-900 p-4 rounded-xl shadow-inner border border-slate-200 dark:border-slate-800">
      {/* Controls */}
      <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm w-full justify-between mb-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <button
            disabled={pageNum <= 1 || isRendering}
            onClick={() => setPageNum(prev => prev - 1)}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md disabled:opacity-50 transition-colors"
          >
            <ChevronLeft size={20} className="text-slate-700 dark:text-slate-300" />
          </button>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Page {pageNum} of {numPages || '--'}
          </span>
          <button
            disabled={pageNum >= numPages || isRendering}
            onClick={() => setPageNum(prev => prev + 1)}
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
        </div>
      </div>

      {/* PDF Canvas Container */}
      <div className="overflow-auto w-full h-[600px] border border-slate-200 dark:border-slate-700 bg-slate-300 dark:bg-slate-950 flex justify-center p-4 rounded-lg shadow-inner">
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
          className="max-w-none shadow-md bg-white"
        />
      </div>
    </div>
  );
}
