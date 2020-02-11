import React from "react"

import Container from "@material-ui/core/Container"
import MuiTypography from "@material-ui/core/Typography"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import Share from "@material-ui/icons/Share"
import { makeStyles, styled } from "@material-ui/core/styles"

const Typography = styled(MuiTypography)({
  lineHeight: 2
})

const list = [
  {
    title: "編成作成",
    content: () => (
      <>
        <Typography>画面最上部の編成一覧を押します。</Typography>
        <Typography>「編成を作成」をクリックして作成します。</Typography>
        <Typography>作成した編成は、自動で編成一覧に保存されます。</Typography>
        <img src="https://i.gyazo.com/24d6a6212e64009a31a0d20a2cbe3ba3.gif" alt="Image from Gyazo" width="800" />
      </>
    )
  },
  {
    title: "艦娘作成",
    content: () => (
      <>
        <Typography>編成画面から艦娘を追加できます。</Typography>
        <Typography>艦娘はドラッグ&ドロップで入れ替えられます。</Typography>
        <img src="https://i.gyazo.com/95443dfd8dc1e95b55d213346653855e.gif" alt="Image from Gyazo" width="800" />
      </>
    )
  },
  {
    title: "艦娘のステータス操作",
    content: () => (
      <>
        <Typography>編成画面上部のステータス表示を押すと、艦娘のステータスが表示されます。</Typography>
        <img src="https://i.gyazo.com/ab15a04f9091254ab7cd400b98890172.gif" alt="Image from Gyazo" width="800" />

        <Typography>レベルや各種アイコンをクリックすることで、ステータスを編集できます。</Typography>
        <img src="https://i.gyazo.com/460b96c79f52e3a7c5f8b09602c52928.gif" alt="Image from Gyazo" width="800" />
      </>
    )
  },
  {
    title: "装備追加",
    content: () => (
      <>
        <Typography>艦娘カードから装備を追加できます。</Typography>
        <img src="https://i.gyazo.com/03dcdff7e8a148b10c9f66e7a89d3c06.gif" alt="Image from Gyazo" width="800" />
      </>
    )
  },
  {
    title: "装備操作",
    content: () => (
      <>
        <Typography>装備の熟練度や改修値をクリックすることで変更できます。</Typography>
        <img src="https://i.gyazo.com/0e0dfa02a078fe11557b719175be0523.gif" alt="Image from Gyazo" width="800" />

        <Typography>装備はドラッグ&ドロップで入れ替えられます。</Typography>
        <img src="https://i.gyazo.com/99095dbe9ab0d00efea884e1662a7152.gif" alt="Image from Gyazo" width="488" />
      </>
    )
  },
  {
    title: "艦隊操作",
    content: () => (
      <>
        <Typography>艦隊はドラッグ&ドロップで入れ替えられます。</Typography>
        <img src="https://i.gyazo.com/9f4dbe98782ae3946a8a7f09e669e307.gif" alt="Image from Gyazo" width="800" />
      </>
    )
  },
  {
    title: "基地設定",
    content: () => (
      <>
        <Typography>編成画面上部の基地航空隊をクリックすると基地画面を開けます。</Typography>
        <Typography>基地はドラッグ&ドロップで入れ替えられます。</Typography>
        <img src="https://i.gyazo.com/c6cd461f2659703ebcc08da638c207be.gif" alt="Image from Gyazo" width="800" />
      </>
    )
  },
  {
    title: "編成共有URLの生成",
    content: () => (
      <>
        <Typography>
          編成画面上部の
          <Share />
          をクリックすると共有画面を開けます。
        </Typography>
        <Typography>そこから「共有URLを生成する」をクリックして少し待つと生成されます。</Typography>
        <img src="https://i.gyazo.com/b2e429abf2aa42c718b02f8e2ffbc6ac.gif" alt="Image from Gyazo" width="800" />
      </>
    )
  }
]

const useStyles = makeStyles(theme => ({
  list: {
    marginBottom: theme.spacing(2)
  }
}))

const Component = () => {
  const classes = useStyles()
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  return (
    <Container>
      <List className={classes.list}>
        {list.map(({ title }, index) => (
          <ListItem key={index} button dense selected={selectedIndex === index} onClick={() => setSelectedIndex(index)}>
            <ListItemText primary={title} />
          </ListItem>
        ))}
      </List>
      {list[selectedIndex].content()}
    </Container>
  )
}

export default Component
