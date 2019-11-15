import { IShip, EnemyTypeId } from "kc-calculator"
import kcObjectFactory from "../../stores/kcObjectFactory"

const createShipFromId = (shipId: number) => {
  const ship = kcObjectFactory.createShip({ masterId: shipId })
  if (!ship) {
    throw new Error(`failed to create ship ${shipId}`)
  }
  return ship
}

export default class EnemyType {
  public static values: EnemyType[] = []

  public static None = new EnemyType("水上艦", createShipFromId(EnemyTypeId.None))
  public static Pillbox = new EnemyType("砲台", createShipFromId(EnemyTypeId.Pillbox))
  public static IsolatedIsland = new EnemyType("離島", createShipFromId(EnemyTypeId.IsolatedIsland))
  public static SoftSkinned = new EnemyType("ソフトスキン", createShipFromId(EnemyTypeId.SoftSkinned))
  public static HarbourSummerPrincess = new EnemyType("港湾夏姫", createShipFromId(EnemyTypeId.HarbourSummerPrincess))
  public static SupplyDepot = new EnemyType("集積", createShipFromId(EnemyTypeId.SupplyDepot))

  private constructor(public name: string, public ship: IShip) {
    EnemyType.values.push(this)
  }
}
