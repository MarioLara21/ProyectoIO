import Menu from '../Menu/Menu';
import NodeInputWindow from '../FloydsAlgorithm/NodeInputWindow';
import FloydsAlgorithm from "../FloydsAlgorithm/FloydsAlgorithm"

export const routes = [
    { path: '/', element: < Menu /> },
    { path: '/floyds-input', element: < NodeInputWindow /> },
    { path: '/floyds-algorithm', element: < FloydsAlgorithm /> },
    // { path: '/knapsack-problem', component: KnapsackProblem },
    // { path: '/equipment-replacement', component: EquipmentReplacement },
    // { path: '/optimal-binary-search-trees', component: OptimalBinarySearchTrees },
    // { path: '/sports-series', component: SportsSeries },
    // { path: '/matrix-multiplication', component: MatrixMultiplication },
    // { path: '/exit', component: Exit }
];