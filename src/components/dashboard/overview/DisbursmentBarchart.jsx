import React, { memo, useEffect, useState } from 'react'
import Chart from '../Chart'
import { Overview_MonthlyDisbursementsAPI } from '../../../api/dashboard';
import { Panel } from '../Helper';
import SkeletonLoader from '../../utils/SkeletonLoader';
import { COLORS, fmtCr } from '../utils';

const DisbursmentBarchart = memo(({ selectedProductsName }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [monthlyDisbursement, setMonthlyDisbursement] = useState([])

    useEffect(() => {
        fetchOverview_MonthlyDisbursements();
    }, []);


    const fetchOverview_MonthlyDisbursements = async () => {
        setIsLoading(true);
        try {
            const req = {
                from_date: "",
                to_date: "",
                product_code: selectedProductsName,
            };
            const response = await Overview_MonthlyDisbursementsAPI(req);
            if (response.status) {
                setMonthlyDisbursement(response.data);
            } else {
                // console.info(response.message || "Something went wrong!");
                console.log(response?.message + " error in Overview_MonthlyDisbursementsAPI")
            }
        } catch (error) {
            toast.error(error.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const monthlyData = {
        labels: monthlyDisbursement?.map((m) => m?.month_name),
        datasets: [
            {
                label: "Amount",
                data: monthlyDisbursement?.map((m) => m?.disbursed_amount),
                backgroundColor: "rgba(47,111,166,0.85)",
                borderColor: COLORS.settled,
                borderWidth: 1,
                borderRadius: 2,
            },
        ],
    };

    return (
        <>
            {!isLoading ? (
                <Panel title="Monthly Disbursements" sub="Loan volume over time (₹)">
                    <div className="relative max-h-65">
                        <Chart
                            type="bar"
                            data={monthlyData}
                            options={{
                                scales: {
                                    y: {
                                        ticks: { callback: (v) => fmtCr(v) },
                                        grid: { color: "#E8EBEE" },
                                    },
                                    x: { grid: { display: false } },
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

export default DisbursmentBarchart;