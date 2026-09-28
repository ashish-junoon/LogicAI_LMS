import React, { memo, useEffect, useState } from 'react'
import { Panel } from '../Helper';
import Chart from '../Chart';
import SkeletonLoader from '../../utils/SkeletonLoader';
import { CustomerProfile_LoanSizeDistributionAPI } from '../../../api/dashboard';
import { toast } from 'react-toastify';

const LoanSizeChart = memo(({ selectedProductsName, type = "bar" }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [loanSizeDistribution, setLoanSizeDistribution] = useState([]);

    useEffect(() => {
        fetchCustomerProfile_LoanSizeDistribution();
    }, []);

    const fetchCustomerProfile_LoanSizeDistribution = async () => {
        setIsLoading(true);
        try {
            const req = {
                from_date: "",
                to_date: "",
                product_code: selectedProductsName,
            };
            const response = await CustomerProfile_LoanSizeDistributionAPI(req);
            if (response.status) {
                setLoanSizeDistribution(response.data);
            } else {
                // console.info(response.message || "Something went wrong!");
                console.log(response?.message + " error in CustomerProfile_LoanSizeDistributionAPI")
            }
        } catch (error) {
            toast.error(error.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const loanDistData = {
        labels: loanSizeDistribution?.map((range) => range?.loan_size_range),
        datasets: [
            {
                data: loanSizeDistribution?.map((loan) => loan?.total_loans),
                backgroundColor: [
                    "#2F6FA6",
                    "#6B54C7",
                    "#1F8F68",
                    "#EB7F31",
                    "#78A4CB",
                    "#DF301C",
                    "#F62477",
                    "#1B4EF5",
                ],
                borderRadius: 2,
                borderWidth: 0,
            },
        ],
    };

    return (
        <>
            <Panel
                title="Loan Size Distribution"
                sub="Number of loans by amount bucket"
            >
                {!isLoading ? (
                    <div className="relative max-h-80 w-fit m-auto">
                        <Chart
                            type={type}
                            data={loanDistData}
                            options={type === "pie" ?
                                {
                                    plugins: {
                                        legend: { display: true, position: "bottom", labels: { color: "#5B6B7A", padding: 10, boxWidth: 8, font: { size: 10.5 } } },
                                    },
                                } :
                                {
                                    scales: {
                                        y: { grid: { color: "#E8EBEE" } },
                                        x: { grid: { display: false } },
                                    },
                                    plugins: { legend: { display: false } },
                                }}
                        />
                    </div>
                ) : (
                    <SkeletonLoader />
                )}
            </Panel>
        </>
    )
})

export default LoanSizeChart;