import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { IShip } from 'kc-calculator'

import DataTable from '../../components/DataTable'
import { baseColumns } from './columns'

const ShipsTable: React.FC<{ ships: IShip[] }> = ({ ships }) => {
  return <DataTable columns={baseColumns} data={ships} />
}
