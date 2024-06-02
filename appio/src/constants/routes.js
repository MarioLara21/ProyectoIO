import Menu from '../Menu/Menu';
import NodeInputWindow from '../FloydsAlgorithm/NodeInputWindow';
import FloydsAlgorithm from "../FloydsAlgorithm/FloydsAlgorithm"
import DataCollection from '../EquipmentReplacement/DataCollection';
import ReplacementAlgorithm from '../EquipmentReplacement/ReplacementAlgorithm';
import BSearchInput from '../BinarySearch/BSearchInput';
import BSearch from '../BinarySearch/BSearch';
import KnapsackProblem from '../KnapsackProblem/BackpackData';
import KnapsackAlgorithm from '../KnapsackProblem/KnapsackAlgorithm';
import MatrixMultiplication from '../MatrixMultiplication/MatrixMultiplication';
import MatrixInput from '../MatrixMultiplication/MatrixInput';
import SportsSeries from '../SportsSeries/SportsSeries';
import SportsSeriesInput from '../SportsSeries/SportsSeriesInput';

export const routes = [
    { path: '/', element: < Menu /> },
    { path: '/floyds-input', element: < NodeInputWindow /> },
    { path: '/floyds-algorithm', element: < FloydsAlgorithm /> },
    { path: '/knapsack-problem', element: <KnapsackProblem/> },
    { path: '/knapsack-algorithm', element: <KnapsackAlgorithm/> },
    { path: '/equipment-input', element: < DataCollection /> },
    { path: '/equipment-replacement', element: < ReplacementAlgorithm /> },
    { path: '/binary-search-input', element: < BSearchInput /> },
    { path: '/binary-search', element: < BSearch /> },
    { path: '/sports-series', element: <SportsSeries />},
    { path: '/sports-series-input', element: <SportsSeriesInput />},
    { path: '/matrix-multiplication', element: <MatrixMultiplication/> },
    { path: '/matrix-input', element: <MatrixInput/>}
    // { path: '/exit', component: Exit }
];