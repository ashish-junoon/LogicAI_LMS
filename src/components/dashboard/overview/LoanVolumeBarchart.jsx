import React, { memo, useEffect, useState } from 'react'
import { PortfolioHealth_NPAbySectorAPI } from '../../../api/dashboard';
import { Panel } from '../Helper';
import Chart from '../Chart';
import SkeletonLoader from '../../utils/SkeletonLoader';
import { COLORS } from '../utils';

const LoanVolumeBarchart = memo(({ selectedProductsName }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [sectorNPA, setsectorNPA] = useState([]);


    useEffect(() => {
        fetchPortfolioHealthNPAbySector();
    }, [selectedProductsName]);

    const fetchPortfolioHealthNPAbySector = async () => {
        setIsLoading(true);
        try {
            const req = {
                from_date: "",
                to_date: "",
                product_code: selectedProductsName,
            };
            const response = await PortfolioHealth_NPAbySectorAPI(req);
            if (response.status) {
                setsectorNPA(response.data);
            } else {
                // console.info(response.message || "Something went wrong!");
                console.log(response?.message + " error in PortfolioHealth_NPAbySectorAPI")
            }
        } catch (error) {
            toast.error(error.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const sortedNPASector = [...(sectorNPA || [])]
        ?.sort((a, b) => b.total_loans - a.total_loans)
        ?.slice(0, 10);

    const sectorData = {
        labels: sortedNPASector?.map((sector) => sector?.sector),
        datasets: [
            {
                label: "Loans",
                data: sortedNPASector?.map((sector) => sector?.total_loans),
                // backgroundColor: "rgba(31,143,104,0.85)",
                backgroundColor: "#66BB6A",
                borderColor: COLORS.paid,
                borderWidth: 1,
                borderRadius: 2,
            },
        ],
    };

    return (
        <>
            {!isLoading ? (
                <Panel title="Top 10 Sectors by Volume" sub="Number of loans">
                    <div className="relative max-h-65">
                        <Chart
                            type="bar"
                            data={sectorData}
                            options={{
                                indexAxis: "y",
                                scales: {
                                    x: { grid: { color: "#E8EBEE" } },
                                    y: {
                                        grid: { display: false },
                                        ticks: { font: { size: 10.5 } },
                                    },
                                },
                            }}
                        />
                    </div>
                </Panel>
            ) : (
                <SkeletonLoader />
            )}
        </>
    )
})

export default LoanVolumeBarchart;