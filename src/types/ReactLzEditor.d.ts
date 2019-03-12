declare module 'react-lz-editor' {
  import * as React from 'react'
  import { UploadProps } from 'antd/lib/upload/Upload'

  declare namespace ReactLzEditor {
    export interface Props extends React.Props<any> {
      active?: boolean // Is reloading content after changing
      importContent?: string // Editor content value, default to ""
      lang?: string // Editor using language, default to your browser language settings
      cbReceiver?: (content?: string) => void // Callback function, the changed value will be sent to its parameter.
      undoRedo?: boolean // Enabled undo and redo feature, default to true
      removeStyle?: boolean // Enabled remove style feature, default to true
      pasteNoStyle?: boolean // Enabled paste plan text feature, default to true
      blockStyle?: boolean // Enabled block style (H1,ol,pre etc.) feature, default to true
      alignment?: boolean // Enabled text alignment feature, default to true
      inlineStyle?: boolean // Enabled inline style (bold, italic, underline etc.) feature, default to true
      color?: boolean // Enabled color text feature, default to true
      image?: boolean // Enabled insert image feature, default to true
      video?: boolean // Enabled insert video feature, default to true
      audio?: boolean // Enabled insert audio feature, default to true
      urls?: boolean // Enabled add hyper link feature, default to true
      autoSave?: boolean // Enabled auto save to draft-box feature, default to true
      fullScreen?: boolean // Enabled full screen feature, default to true
      convertFormat?: string // Set support format (html, markdown, raw), default to "html"
      uploadProps?: UploadProps // Customize uploading settings. API: Antd.Upload
    }
  }

  declare class LzEditor extends React.Component<ReactLzEditor.Props> {}

  export = LzEditor

  export as namespace ReactLzEditor
}
