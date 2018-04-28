/**
 * 工作表
 */
import worksheet from '../views/worksheet/main.vue'
import worksheetList from '../views/worksheet/list'
import jointables from '../views/worksheet/jointables'

export default {
    path: '/worksheet',
    name: 'worksheet',
    component: worksheet,
    children: [
    	{
    		path: 'list',
    		name: 'list',
    		component: worksheetList
    	},
        {
            path: 'jointables',
            name: 'jointables',
            component: jointables
        }
    ]
}