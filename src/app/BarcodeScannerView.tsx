'use client';

import { useState, useEffect, useRef } from 'react';

// ═══════════════════════════════════════════════════════
// 实时扫码组件 — getUserMedia + ZXing decodeFromVideoDevice
// ═══════════════════════════════════════════════════════
export default function BarcodeScannerView({ onScan, onError, onClose }: {
  onScan: (b: string) => void;
  onError: (m: string) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState('启动摄像头...');
  const stoppedRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    stoppedRef.current = false;

    const start = async () => {
      try {
        // 检查 getUserMedia 支持
        if (!navigator.mediaDevices?.getUserMedia) {
          if (mounted) { setStatus('不支持摄像头'); onError('此设备不支持摄像头访问'); }
          return;
        }

        // 请求后置摄像头
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });

        if (!mounted || stoppedRef.current) { stream.getTracks().forEach(t => t.stop()); return; }

        const video = videoRef.current;
        if (!video) return;

        video.srcObject = stream;
        video.setAttribute('playsinline', 'true');
        await video.play();

        setStatus('对准条码...');

        // 用 ZXing 从视频流解码
        const { BrowserMultiFormatReader } = await import('@zxing/library');
        const reader = new BrowserMultiFormatReader();

        // decodeFromVideoDevice 持续回调
        await reader.decodeFromVideoDevice(
          null,   // deviceId（null = 默认摄像头，但我们已自己开了 stream）
          video,
          (result, err) => {
            if (stoppedRef.current) return;
            if (result) {
              stoppedRef.current = true;
              // 停止所有轨道
              stream.getTracks().forEach(t => t.stop());
              reader.reset();
              onScan(result.getText());
            }
            // err is normal for each non-detection frame — don't report
          }
        );

      } catch (err: any) {
        if (!mounted) return;
        const msg = err?.message || String(err);
        if (msg.includes('NotAllowed')) { setStatus('权限被拒'); onError('摄像头权限未授权'); }
        else if (msg.includes('NotFound')) { setStatus('无摄像头'); onError('设备无摄像头'); }
        else { setStatus('错误'); onError(msg); }
      }
    };

    start();

    return () => {
      mounted = false;
      stoppedRef.current = true;
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* 摄像头画面 */}
      <video ref={videoRef} muted playsInline className="absolute inset-0 w-full h-full object-cover" />

      {/* 取景框 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="border-2 border-green-400/80 rounded-2xl relative" style={{ width: 260, height: 170 }}>
          <span className="absolute -top-1 -left-1 w-6 h-6 border-t-[3px] border-l-[3px] border-green-400 rounded-tl-lg" />
          <span className="absolute -top-1 -right-1 w-6 h-6 border-t-[3px] border-r-[3px] border-green-400 rounded-tr-lg" />
          <span className="absolute -bottom-1 -left-1 w-6 h-6 border-b-[3px] border-l-[3px] border-green-400 rounded-bl-lg" />
          <span className="absolute -bottom-1 -right-1 w-6 h-6 border-b-[3px] border-r-[3px] border-green-400 rounded-br-lg" />
        </div>
      </div>

      {/* 状态 */}
      <div className="absolute top-8 left-0 right-0 text-center z-10">
        <p className="text-white text-lg font-bold drop-shadow-lg">{status}</p>
      </div>

      {/* 取消 */}
      <button onClick={() => { stoppedRef.current = true; onClose(); }}
        className="absolute bottom-28 left-1/2 -translate-x-1/2 bg-red-600 text-white px-8 py-3 rounded-xl text-lg font-bold z-10 active:bg-red-700 shadow-lg">
        ✕ 取消扫码
      </button>
    </div>
  );
}
