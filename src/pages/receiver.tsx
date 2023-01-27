import TabsDemo from "@/components/tabs";
import React, { useEffect, useMemo } from "react";
import * as Separator from '@radix-ui/react-separator';

import styles from '@/styles/tab.module.css'
import usePeerJs from "@/hooks/peerjs";

import separatorStyles from '@/styles/separator.module.css'
import receiverStyles from '@/styles/receiver.module.css'

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
  const [dataArray, {getConn}] = usePeerJs('receiver');
  const [files, setFiles] = React.useState<any>(dataArray)
  const [senderId, setSenderId] = React.useState<string>('')

  useEffect(() => {
    if(!dataArray || dataArray.length === 0) return;
    console.log(dataArray)
    handleMessages(dataArray)
  }, [dataArray])


  function handleMessages(dataArray: any[]) {
    const data = dataArray[dataArray.length - 1]
    if(data.handShake){
      return handleHandShake(data);
    } else if (data.file) {
      return handleFile(data);
    } else {
      console.log(data)
    }
  }

  function handleHandShake(data: any) {
    console.log(data)
    setSenderId(data.userId);
    const conn = getConn();
    if(!conn) return alert('No connection');
    conn.send({handShake: true, userId: 'receiver'})
  }

  function handleFile(data: any) {
    console.log(data)
    if (data.filetype?.includes('image')) {
      const bytes = new Uint8Array(data.file)
      const encoded = 'data:image/png;base64,' + encode(bytes)
      setFiles([...files, {...data, filename: data.filename, encoded: encoded}])
    }
  }

  
  return (
    <div style={{width: '100%'}}>
      <h1>Receive Files - {senderId ? senderId : 'No sender connected'}</h1>
      <Separator.Root className={separatorStyles.SeparatorRoot} style={{ margin: '15px 0' }} />

      {/* list of files available */}
      <ul className={receiverStyles.ImagesList}>
        {files.map((file:any, index: number) => (
          <li key={index}><img className={receiverStyles.ImageReceived} src={file.encoded} alt=""/></li>
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
