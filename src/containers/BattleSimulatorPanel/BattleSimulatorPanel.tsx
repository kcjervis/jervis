import { BattleSimulator, IFleet, Formation } from "kc-calculator"
import React from "react"
import { SeamapPanelStateContext } from "../Dialogs"

import Button from "@material-ui/core/Button"

import { Text, ShipBanner, Flexbox, NumberInput } from "../../components"
import BattleLogPanel from "./BattleLogPanel"

const BattleSimulatorPanel: React.FC<{ fleet: IFleet }> = ({ fleet }) => {
  const mapPanelState = React.useContext(SeamapPanelStateContext)
  const [enemyFleet, setEnemyFleet] = React.useState<IFleet>()
  const [name, setName] = React.useState<string>("")
  const [formation, setFormation] = React.useState<Formation>(Formation.LineAhead)

  const [trialNumber, setTrialNumber] = React.useState(1000)

  const handleMapSelect = React.useCallback(() => {
    mapPanelState.onOpen({
      onSelect: enemyOperation => {
        setName(enemyOperation.name + enemyOperation.formation.name)
        setEnemyFleet(enemyOperation.fleets[0].asKcObject)
        setFormation(enemyOperation.formation)
      }
    })
  }, [mapPanelState, setName, setEnemyFleet, setFormation])

  const [result, setResult] = React.useState<BattleSimulator["record"]>()

  const handleStart = () => {
    if (!enemyFleet) {
      return
    }
    const simulator = new BattleSimulator(fleet, enemyFleet, formation)
    setResult(simulator.do(trialNumber))
  }

  let enemyElem: React.ReactNode
  if (enemyFleet) {
    const ships = enemyFleet.nonNullableShips
    enemyElem = (
      <>
        <Text>{name}</Text>
        {ships.map((ship, index) => (
          <ShipBanner key={index} size="small" shipId={ship.shipId} />
        ))}
        <Flexbox>
          <NumberInput label="試行回数" value={trialNumber} onChange={setTrialNumber} min={100} step={100} />
          <Button onClick={handleStart}>実行</Button>
        </Flexbox>
      </>
    )
  }

  return (
    <>
      <Button onClick={handleMapSelect}>敵艦隊を選択</Button>
      {enemyElem}
      {result && <BattleLogPanel record={result} />}
    </>
  )
}

export default BattleSimulatorPanel
