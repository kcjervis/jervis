import React from "react"
import { Mention, Timeline } from "react-twitter-widgets"

import Container from "@material-ui/core/Container"
import Box from "@material-ui/core/Box"
import Link from "@material-ui/core/Link"
import Divider from "@material-ui/core/Divider"
import Typography from "@material-ui/core/Typography"
import { makeStyles, styled } from "@material-ui/core/styles"

import Card from "@material-ui/core/Card"
import CardHeader from "@material-ui/core/CardHeader"
import CardContent from "@material-ui/core/CardContent"

import { version } from "../../../version"

const useStyles = makeStyles(theme => ({
  margin: {
    marginTop: theme.spacing(4)
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}))

const H2: React.FC = ({ children }) => {
  const classes = useStyles()
  return (
    <>
      <Typography className={classes.margin} variant="h5" component="h2">
        {children}
      </Typography>
      <Divider className={classes.divider} />
    </>
  )
}

const Home: React.FC = () => {
  const classes = useStyles()
  return (
    <Container>
      <Typography className={classes.margin} variant="h4" component="h1">
        作戦室 v{version}
      </Typography>

      <Card style={{ marginTop: 16, backgroundColor: "rgba(15, 20, 20, 0.9)" }}>
        <CardHeader title={<Typography variant="h4">サイト移転のお知らせ</Typography>} />

        <CardContent>
          <p>
            長らく更新が滞っており申し訳ありませんでした。
            <br />
            今後こちらでの更新は停止して、
            <Link href="https://jervis.vercel.app">移転先</Link>
            にて開発していきます。
          </p>

          <Link href="https://jervis.vercel.app" variant="h5" color="secondary" underline="always">
            jervis.vercel.app
          </Link>
        </CardContent>
      </Card>

      <H2>よくある質問</H2>
      <Box m={1}>
        <Typography>
          Q.なんで
          <Link href="#help" target="_self">
            使い方
          </Link>
          ちゃんと書かないの？
        </Typography>
        <Typography>A.仕様変更の頻度が高すぎて書けないごめん。</Typography>
      </Box>
      <Box m={1}>
        <Typography>Q.このサイト何ができるの？</Typography>
        <Typography>
          A.編成保存、編成共有、索敵計算、夜戦CI率、昼CI率、対空CI率、触接率とか。基地削り計算は制空権シミュレータを使った方がいいと思う。ダメージと命中率計算もできるけど作りかけだからあんまり信用しないでね。
        </Typography>
      </Box>

      <H2>連絡先</H2>
      <Link href="https://marshmallow-qa.com/madonoharu">マシュマロ(匿名でメッセージを送る)</Link>
      <Mention username="MadonoHaru" />
      <Timeline
        dataSource={{
          sourceType: "profile",
          screenName: "MadonoHaru"
        }}
        options={{
          height: 400,
          width: 400
        }}
      />

      <H2>免責事項</H2>
      <Typography>
        当サイトに表示される情報は仮説式等を多く使用しているため、その正確性については保障しません。また、当サイトの計算結果によって発生した損害について一切の責任を負いません。
      </Typography>

      <H2>プライバシーポリシー</H2>
      <Typography>
        当サイトでは、Googleの提供するアクセス解析サービス「Google
        Analytics」を使用しています。これにはデータ収集のためにCookieを使用しておりますが、このデータは匿名で収集されており、個人を特定するものではありません。
        詳しくは<Link href="https://policies.google.com/technologies/partner-sites">こちら</Link>をご覧ください。
      </Typography>

      <H2>知的財産権</H2>
      <Typography>
        当サイトで使用されている画像の知的財産権は、その権利者様に帰属します。権利者様からの削除依頼には速やかに対処いたします。
      </Typography>
    </Container>
  )
}

export default Home
