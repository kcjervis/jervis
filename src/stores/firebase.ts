import firebase from "firebase/app"
import "firebase/storage"
import uuid from "uuid"
import ObservableOperation from "./ObservableOperation"

firebase.initializeApp({
  apiKey: "AIzaSyCL42Zt_fL5Bxj4mgbTcX9T-EOnzhvptbQ",
  authDomain: "jervis-6f57c.firebaseapp.com",
  databaseURL: "https://jervis-6f57c.firebaseio.com",
  projectId: "jervis-6f57c",
  storageBucket: "jervis-6f57c.appspot.com",
  messagingSenderId: "34493730451"
})

const storageRef = firebase.storage().ref()

export const urlShortener = async (url: string, domain: "jervis" | "kancolle") => {
  const apiKey = "AIzaSyCL42Zt_fL5Bxj4mgbTcX9T-EOnzhvptbQ"
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
  const body = {
    longDynamicLink: `https://${domain}.page.link/?link=${url}`,
    suffix: {
      option: "SHORT"
    }
  }
  const res = await fetch(`https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${apiKey}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  })
  const json = await res.json()
  return json as { previewLink: string; shortLink: string } | { error: { code: number } }
}

export const setOperation = async (operation: ObservableOperation) => {
  const file = new File([JSON.stringify(operation)], "name", { type: "application/json" })
  const filePath = `operations/${uuid()}.json`
  const snapshot = await storageRef.child(filePath).put(file)
  return filePath
}

export const getOperation = async (filePath: string) => {
  const url = await storageRef.child(filePath).getDownloadURL()
  const json = await fetch(url).then(res => res.json())
  return ObservableOperation.create(json)
}
