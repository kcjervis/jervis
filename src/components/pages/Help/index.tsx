import React from "react"

import TreeView from "@material-ui/lab/TreeView"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import ChevronRightIcon from "@material-ui/icons/ChevronRight"
import TreeItem from "@material-ui/lab/TreeItem"

const Component = () => {
  const handleTreeItemClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    console.log(event.currentTarget)
  }

  return (
    <div>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon color="action" />}
        defaultExpandIcon={<ChevronRightIcon color="action" />}
      >
        <TreeItem nodeId="1" label="編成作成">
          <TreeItem nodeId="2" label="艦娘追加" onClick={handleTreeItemClick} />
          <TreeItem nodeId="3" label="装備追加" onClick={handleTreeItemClick} />
          <TreeItem nodeId="4" label="基地設定" onClick={handleTreeItemClick} />
        </TreeItem>
        <TreeItem nodeId="5" label="艦隊のステータス">
          <TreeItem nodeId="6" label="Material-UI">
            <TreeItem nodeId="7" label="src">
              <TreeItem nodeId="8" label="index.js" />
              <TreeItem nodeId="9" label="tree-view.js" />
            </TreeItem>
          </TreeItem>
        </TreeItem>
      </TreeView>
    </div>
  )
}

export default Component
