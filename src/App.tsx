import { useCallback, useEffect, useId, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import axios from "axios";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  CloudflareStreamResponse,
  CreateStreamInputResponse,
  Result,
} from "./dto/cloudflare";

function App() {
  const [streamInput, setStreamInput] =
    useState<CreateStreamInputResponse | null>(null);
  const [stream, setStream] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const getStreamKey = async () => {
    const res = await axios.post<{ result: CreateStreamInputResponse }>(
      `https://api.cloudflare.com/client/v4/accounts/${
        import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID
      }/stream/live_inputs`,
      {
        meta: { name: inputRef?.current?.value || "Testing" },
        recording: { mode: "automatic" },
      },
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_CLOUDFLARE_API_TOKEN}`,
        },
      }
    );
    setStreamInput({ ...res.data.result });
  };

  useEffect(() => {
    if (!streamInput) return;
    const getLiveStream = async () => {
      let livingStream: Result | null = null;
      while (!livingStream) {
        const res = await axios.get<CloudflareStreamResponse>(
          `https://api.cloudflare.com/client/v4/accounts/${
            import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID
          }/stream/live_inputs/${streamInput?.uid}/videos`,
          {
            headers: {
              Authorization: `Bearer ${
                import.meta.env.VITE_CLOUDFLARE_API_TOKEN
              }`,
            },
          }
        );
        livingStream =
          res.data.result.find(
            (stream) => stream.status.state === "live-inprogress"
          ) ?? null;
        if (livingStream) {
          setStream(livingStream.playback.hls.replace('manifest/video.m3u8', 'iframe'));
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    };

    getLiveStream();
  }, [streamInput]);

  return (
    <>
      <label htmlFor={inputId}>Stream name</label>
      <input id={inputId} ref={inputRef} />
      <button onClick={getStreamKey}>Get stream key</button>
      {streamInput && (
        <table>
          <thead>
            <tr>
              <th>Stream name</th>
              <th>Stream key</th>
              <th>Stream url</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{streamInput?.meta.name}</td>
              <td>{streamInput?.rtmps.streamKey}</td>
              <td>{streamInput?.rtmps.url}</td>
            </tr>
          </tbody>
        </table>
      )}
      {stream && (
          <div style={{position: 'relative', paddingTop: '56.25%'}}>
          <iframe
            src={stream}
            style={{border: 'none', position : 'absolute', top: 0, left:0, height: '100%', width: '100%'}}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          ></iframe>
        </div>
      )}
    </>
  );
}

export default App;
