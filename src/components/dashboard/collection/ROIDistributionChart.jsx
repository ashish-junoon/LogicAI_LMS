import React, { memo, useEffect, useState } from 'react'
import { Panel } from '../Helper';
import Chart from '../Chart';
import SkeletonLoader from '../../utils/SkeletonLoader';
import { Financials_ROIDistributionAPI } from '../../../api/dashboard';

const ROIDistributionChart = memo(({ selectedProductsName }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [ROIDistribution, setROIDistribution] = useState([]);

    const RoiDistributionDetailsData = {
        labels: ROIDistribution?.map((item) => item?.roi_distribution),
        datasets: [
            {
                data: ROIDistribution?.map((item) => item?.roi_distribution_count),
                backgroundColor: ["#C1443C", "#B9800F", "#96690F", "#2F6FA6", "#1F8F68", "#1B7A59"],
                borderWidth: 0,
                borderRadius: 2,
            },
        ],
    };

    const fetchFinancials_ROIDistribution = async () => {
        setIsLoading(true);
        try {
            const req = { from_date: "", to_date: "", product_code: selectedProductsName };
            const response = await Financials_ROIDistributionAPI(req);
            if (response.status) {
                setROIDistribution(response.data);
            } else {
                console.info(response.message || "Something went wrong!");
            }
        } catch (error) {
            toast.error(error.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFinancials_ROIDistribution();
    }, []);

    return (
        <Panel title="ROI Distribution" sub="Interest rate bands">
            {!isLoading ? (
                <div className="relative max-h-80">
                    <Chart
                        type="bar"
                        data={RoiDistributionDetailsData}
                        options={{
                            scales: { y: { grid: { color: "#E8EBEE" } }, x: { grid: { display: false } } },
                            plugins: { legend: { display: false } },
                        }}
                    />
                </div>
            ) : (
                <SkeletonLoader />
            )}
        </Panel>
    )
})

export default ROIDistributionChart;