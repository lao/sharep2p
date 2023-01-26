import { useState, useEffect, useRef } from "react";

function log (...args: any[]) {
  console.log(...args);
}

const usePeerJs = (id?: string) => {
  id = id || 'receiver'
  const [peer, setPeerJs] = useState<any>(null);
  const [conn, setConn] = useState<any>();
  const [dataStream, setDataStream] = useState<any>([]);
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    // just stop the function if the data has already been fetched
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    const fn = async () => {
      const PeerJs = (await import('peerjs')).default;
      // set it to state here
      const peer = new PeerJs(id as string, { host: 'localhost', port: 9000, path: '/' })
      log('peer: ', peer)
      setPeerJs(peer);
      peer.on('connection', (conn) => {
        log('connected: ', conn)
        setConn(conn);
        conn.on('data', (data:any) => {
          log('data: ', data)
          setDataStream([...dataStream, data]);
        })
      });
        
    }
    fn()

    return () => {
      const peerJS = peer as any;
      peerJS?.disconnect()
      peerJS?.destroy()
    }
  }, []);

  const getPeer = () => peer;
  const getConn = () => conn;

  return [dataStream as any, {getPeer, getConn}];
};

export default usePeerJs;