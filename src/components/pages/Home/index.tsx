import React from "react"
import { Mention } from "react-twitter-widgets"

import Container from "@material-ui/core/Container"
import Link from "@material-ui/core/Link"
import Typography from "@material-ui/core/Typography"
import Alert from "@material-ui/lab/Alert"
import { makeStyles } from "@material-ui/core/styles"

import { version } from "../../../version"

const useStyles = makeStyles(theme => ({
  margin: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(1)
  }
}))

const Home: React.FC = () => {
  const classes = useStyles()
  return (
    <Container maxWidth="md">
      <Typography variant="h4">作戦室 v{version}</Typography>
      <Alert severity="warning" variant="outlined">
        当サイトは現在開発中です。
      </Alert>

      <Typography>
        作戦室では艦隊作成に必要な様々な計算が行えます。
        <br />
        <Link href="#operations" target="_self">
          編成を作成
        </Link>
        してみましょう。
      </Typography>

      <Typography className={classes.margin} variant="h5">
        連絡
      </Typography>
      <Link href="https://twitter.com/MadonoHaru">まどの(@MadonoHaru)</Link>
      <Mention username="MadonoHaru" />

      <Typography className={classes.margin} variant="h5">
        免責事項
      </Typography>
      <Typography>
        当サイトに表示される情報は仮説式等を多く使用しているため、その正確性については保障しません。また、当サイトの計算結果によって発生した損害について一切の責任を負いません。
      </Typography>

      <Typography className={classes.margin} variant="h5">
        プライバシーポリシー
      </Typography>
      <Typography>
        当サイトでは、Googleの提供するアクセス解析サービス「Google
        Analytics」を使用しています。これにはデータ収集のためにCookieを使用しておりますが、このデータは匿名で収集されており、個人を特定するものではありません。
        詳しくは<Link href="https://policies.google.com/technologies/partner-sites">こちら</Link>をご覧ください。
      </Typography>

      <Typography className={classes.margin} variant="h5">
        知的財産権
      </Typography>
      <Typography>
        当サイトで使用されている画像の知的財産権は、その権利者様に帰属します。権利者様からの削除依頼には速やかに対処いたします。
      </Typography>
    </Container>
  )
}

export default Home
