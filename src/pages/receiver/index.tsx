import TabsDemo from "@/components/tabs";
import React from "react";
import styles from '@/styles/tab.module.css'


const encode = (input:any) => {
  const keyStr =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  let output = ''
  let chr1, chr2, chr3, enc1, enc2, enc3, enc4
  let i = 0

  while (i < input.length) {
    chr1 = input[i++]
    chr2 = i < input.length ? input[i++] : Number.NaN // Not sure if the index
    chr3 = i < input.length ? input[i++] : Number.NaN // checks are needed here

    enc1 = chr1 >> 2
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
    enc4 = chr3 & 63

    if (isNaN(chr2)) {
      enc3 = enc4 = 64
    } else if (isNaN(chr3)) {
      enc4 = 64
    }
    output +=
      keyStr.charAt(enc1) +
      keyStr.charAt(enc2) +
      keyStr.charAt(enc3) +
      keyStr.charAt(enc4)
  }
  return output
}

function ReceiveFiles() {
  let PeerJs;
  let peer:any;
  const [files, setFiles] = React.useState<any>([])

  React.useEffect(() => {
    const fn = async () => {
      PeerJs = (await import('peerjs')).default;
      // set it to state here
      peer = new PeerJs('receiver', { host: 'localhost', port: 9000, path: '/' })
      peer?.on('connection', (conn:any) => {
        console.log('connected');
        console.log(conn);
        conn.on('data', (data:any) => {
          console.log(data);
          console.log('hello')
          if (data.filetype.includes('image')) {
            const bytes = new Uint8Array(data.file)
            setFiles([...files, 'data:image/png;base64,' + encode(bytes)])
          }
        })
      })
    }
    fn()

    
  }, [setFiles]); // empty array here ensures this is only executed once (when that component mounts).
  
  
  
  return (
    <div style={{width: '100%'}}>
      <h1>Receive Files</h1>
      {/* list of files available */}
      <ul>
        {files.map((file:any, index:number) => (
          <li key={index}><img src={file} alt=""/></li>
        ))}
      </ul>
    </div>
  )
}



export default function Receiver() {
  const tabItems = [
    {
      id: 'receiveFiles',
      label: 'Files to download',
      content: ReceiveFiles()
    },
    
  ];
  return (
    <div className={styles.TabWrapper}>
      <TabsDemo items={tabItems}></TabsDemo>
    </div>
  )
}
