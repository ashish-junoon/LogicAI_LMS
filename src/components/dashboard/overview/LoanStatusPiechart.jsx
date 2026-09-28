import React, { memo, useEffect, useState } from 'react'
import SkeletonLoader from '../../utils/SkeletonLoader';
import { Panel } from '../Helper';
import { Overview_LoanStatusDistributionAPI } from '../../../api/dashboard';
import Chart from '../Chart';
import { COLORS } from '../utils';

const LoanStatusPiechart = memo(({ selectedProductsName }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [loanStatusDistribution, setloanStatusDistribution] = useState([]);

    const totalLoan = loanStatusDistribution?.reduce(
        (acc, val) => val?.loan_count + acc,
        0,
    );
    const statusData = {
        labels: loanStatusDistribution?.map((item) => item?.loan_status),
        datasets: [
            {
                data: loanStatusDistribution?.map((item) => item?.loan_count),
                // backgroundColor: STATUS_RAMP,
                backgroundColor: loanStatusDistribution?.map(
                    (item) => COLORS[item?.loan_status?.toLowerCase()] || "#64748b",
                ),
                borderWidth: 2,
                borderColor: "#FFFFFF",
            },
        ],
    };

    useEffect(() => {
        fetchOverview_LoanStatusDistribution();
    }, [selectedProductsName]);

    const fetchOverview_LoanStatusDistribution = async () => {
        setIsLoading(true);
        try {
            const req = {
                from_date: "",
                to_date: "",
                product_code: selectedProductsName,
            };
            const response = await Overview_LoanStatusDistributionAPI(req);
            if (response.status) {
                setloanStatusDistribution(response.data);
            } else {
                // console.info(response.message || "Something went wrong!");
                console.log(response?.message + " error in Overview_LoanStatusDistributionAPI")
            }
        } catch (error) {
            toast.error(error.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {!isLoading ? (
                <Panel
                    title="Loan Status Distribution"
                    sub={`All ${totalLoan?.toLocaleString()} loans`}
                >
                    <div className="relative max-h-65 w-fit m-auto">
                        <Chart
                            type="doughnut"
                            data={statusData}
                            options={{
                                cutout: "60%",
                                plugins: {
                                    legend: {
                                        display: true,
                                        position: "bottom",
                                        labels: {
                                            color: "#5B6B7A",
                                            padding: 10,
                                            boxWidth: 8,
                                            font: { size: 10.5 },
                                        },
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

export default LoanStatusPiechart;