import React from "react"

import Button from "@material-ui/core/Button"
import Link from "@material-ui/core/Link"
import List from "@material-ui/core/List"
import MuiListItem from "@material-ui/core/ListItem"
import MuiListItemText from "@material-ui/core/ListItemText"

import { styled, withStyles } from "@material-ui/core/styles"

import CopyableTextarea from "./CopyableTextarea"
import { CopyTextButton, Flexbox } from "../../"

import { ObservableOperation } from "../../../stores"
import { setOperation, urlShortener } from "../../../stores/firebase"

const LinkListItem: React.FC<{ href: string; secondary?: string }> = ({ href, secondary, children }) => {
  return (
    <MuiListItem>
      <MuiListItemText primary={<Link href={href}>{children}</Link>} secondary={secondary} />
    </MuiListItem>
  )
}

type ComponentProps = {
  predeck: string
  shareUrl?: string
  onCreateUrl?: () => void
}

export const Component: React.FC<ComponentProps> = ({ predeck, shareUrl, onCreateUrl }) => {
  return (
    <div>
      {shareUrl ? (
        <Flexbox>
          <Link href={shareUrl}>{shareUrl}</Link>
          <CopyTextButton value={shareUrl} />
        </Flexbox>
      ) : (
        <Button onClick={onCreateUrl} variant="outlined" color="primary">
          共有URLを生成する
        </Button>
      )}
      <List>
        <LinkListItem
          href={`https://www.nishikuma.net/ImgKCbuilder?predeck=${predeck}`}
          secondary="かっこいい編成画像が作れるサイト"
        >
          編成画像出力で開く
        </LinkListItem>
        <LinkListItem
          href={`https://noro6.github.io/kcTools/?predeck=${predeck}`}
          secondary="道中損耗も計算できる高性能なサイト"
        >
          制空権シミュレータで開く
        </LinkListItem>
        <LinkListItem href={`http://kancolle-calc.net/deckbuilder.html?predeck=${predeck}`}>
          デッキビルダーで開く
        </LinkListItem>
      </List>
      <CopyableTextarea label="デッキビルダー形式" value={predeck} />
    </div>
  )
}

const useOperationShare = (operation: ObservableOperation) => {
  const [shareUrl, setShareUrl] = React.useState<string>()
  const [isLoading, setIsLoading] = React.useState(false)

  const createUrl = React.useCallback(async () => {
    if (isLoading) {
      return
    }

    setIsLoading(true)

    const url = new URL(window.location.href)
    url.hash = ""
    const operationJson = JSON.stringify(operation)
    url.searchParams.set("operation-json", operationJson)

    if (url.href.length > 6500 || operationJson.includes("#")) {
      const pathName = await setOperation(operation)
      url.searchParams.delete("operation-json")
      url.searchParams.set("operation-path", pathName)
    }

    const shortenerRes = await urlShortener(url.href, "jervis")

    setIsLoading(false)

    if ("shortLink" in shortenerRes) {
      const { shortLink } = shortenerRes
      setShareUrl(shortLink)
      return shortLink
    }

    return url.href
  }, [isLoading, operation])

  return { shareUrl, createUrl }
}

type Props = {
  operation: ObservableOperation
}

const Container: React.FC<Props> = ({ operation }) => {
  const { shareUrl, createUrl } = useOperationShare(operation)
  const predeck = operation.toDeckJson(false)

  return <Component predeck={predeck} shareUrl={shareUrl} onCreateUrl={createUrl} />
}

export default Container
