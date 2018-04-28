import { fetch } from './base'
import report from './report'
import addChart from './add-chart.js'
import datasource from './datasource'
import worksheet from './worksheet'
import sql from './sql'
import view from './view'

export default {
	...addChart,
    ...datasource,
    ...worksheet,
    ...report,
    ...sql,
    ...view
}