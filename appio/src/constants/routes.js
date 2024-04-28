import Menu from '../Menu/Menu';
import NodeInputWindow from '../FloydsAlgorithm/NodeInputWindow';
import FloydsAlgorithm from "../FloydsAlgorithm/FloydsAlgorithm"
import DataCollection from '../EquipmentReplacement/DataCollection';
import ReplacementAlgorithm from '../EquipmentReplacement/ReplacementAlgorithm';
import BSearchInput from '../BinarySearch/BSearchInput';
import BSearch from '../BinarySearch/BSearch';

export const routes = [
    { path: '/', element: < Menu /> },
    { path: '/floyds-input', element: < NodeInputWindow /> },
    { path: '/floyds-algorithm', element: < FloydsAlgorithm /> },
    // { path: '/knapsack-problem', component: KnapsackProblem },
    { path: '/equipment-input', element: < DataCollection /> },
    { path: '/equipment-replacement', element: < ReplacementAlgorithm /> },
    { path: '/binary-search-input', element: < BSearchInput /> },
    { path: '/binary-search', element: < BSearch /> },
    // { path: '/sports-series', component: SportsSeries },
    // { path: '/matrix-multiplication', component: MatrixMultiplication },
    // { path: '/exit', component: Exit }
];