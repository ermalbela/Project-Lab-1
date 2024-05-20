import { useState, useEffect } from 'react';

const useQuicksort = (data, key) => {
    const [sortedData, setSortedData] = useState([]);

    useEffect(() => {
        const quicksort = (array) => {
            if (array.length <= 1) {
                return array;
            }

            const pivot = array[Math.floor(array.length / 2)][key];
            const before = array.filter(item => new Date(item[key]) < new Date(pivot));
            const after = array.filter(item => new Date(item[key]) > new Date(pivot));
            const equal = array.filter(item => new Date(item[key]).getTime() === new Date(pivot).getTime());

            return [...quicksort(before), ...equal, ...quicksort(after)];
        };

        setSortedData(quicksort(data));
    }, [data, key]);

    return sortedData;
};

export default useQuicksort;