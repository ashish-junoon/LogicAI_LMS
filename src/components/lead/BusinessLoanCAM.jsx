import React, { useEffect, useMemo, useState } from "react";
import "./BusinessLoanCAM.css";
import { CAMREPORT, SettingApplicationStep } from "../../api/application.js";
import { useAuthData } from "../../context/authContext.jsx";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { showValidationError } from "../utils/common.jsx";
import Modal from "../utils/Modal.jsx";

/**
 * Business Loan CAM
 * - Controlled React state
 * - Live eligibility/EMI/score calculations
 * - Structured API payload via onSave(payload)
 * - Optional persistence in localStorage
 *
 * Usage:
 * <BusinessLoanCAM onSave={(payload) => SaveCAM(payload)} />
 */
const STORAGE_KEY = "cam-generator-case-v1";

const SAMPLE = {
  profile: {
    cam_date: "2026-10-05",
    branch: "Pune - Hinjewadi",
    rm: "R. Kulkarni",
    analyst: "A. Mehta",
    name: "Aarav Precision Components Pvt Ltd",
    constitution: "Private Limited Company",
    pan: "AAPCA1234K",
    gstin: "27AAPCA1234K1Z5",
    industry: "Manufacturer of CNC-machined auto components (Tier-2 OEM supplier)",
    ind_risk: "Medium",
    start_date: "2016-06-15",
    premises: "Rented",
    address: "Plot 14, MIDC Chakan, Pune 410501",
    promoter: "Rohan Deshpande",
    dob: "1982-03-20",
    residence: "Owned",
    experience: 18,
    guarantors: "Neha Deshpande (Director)",
    loan_type: "Unsecured",
    loan_amt: 3000000,
    tenure: 36,
    roi: 16,
    purpose: "Working capital: raw material for new OEM order",
    repay: "Monthly EMI via NACH",
  },
  fin: {
    years: ["FY2023-24", "FY2024-25", "FY2025-26"],
    status: ["Audited", "Audited", "Provisional"],
    rev: [32000000, 38000000, 44000000],
    oi: [200000, 250000, 300000],
    cogs: [22400000, 26300000, 30200000],
    emp: [2900000, 3300000, 3800000],
    opex: [2700000, 3200000, 3700000],
    dep: [600000, 700000, 800000],
    int: [900000, 1000000, 1100000],
    tax: [675000, 940000, 1180000],
    cap: [5000000, 5000000, 5000000],
    res: [6000000, 8810000, 12330000],
    quasi: [1500000, 1500000, 1500000],
    ltb: [4000000, 3400000, 2800000],
    stb: [5000000, 6000000, 6500000],
    pay: [3500000, 4000000, 4600000],
    ocl: [800000, 900000, 1000000],
    nfa: [7500000, 8000000, 8700000],
    invest: [500000, 500000, 800000],
    stock: [6000000, 7000000, 8000000],
    rec: [8000000, 9500000, 10800000],
    cash: [1300000, 1600000, 2000000],
    oca: [2500000, 3010000, 3430000],
  },
  bank: {
    acct: "Bank A - Current A/c xxxx4521 (primary)",
    rows: [
      ["Oct-25", 3450000, 42, 3364000, [820000, 943000, 779000, 1000000, 722000, 861000], 0, 1, 60000],
      ["Nov-25", 3320000, 40, 3237000, [943000, 874000, 1026000, 874000, 897000, 874000], 0, 0, 45000],
      ["Dec-25", 3580000, 45, 3491000, [779000, 1092000, 864000, 1110000, 836000, 955000], 1, 0, 80000],
      ["Jan-26", 3610000, 44, 3519000, [1074000, 774000, 1074000, 774000, 1074000, 774000], 0, 0, 50000],
      ["Feb-26", 3720000, 47, 3627000, [827000, 1081000, 827000, 1081000, 827000, 1081000], 0, 1, 70000],
      ["Mar-26", 4120000, 52, 4017000, [861000, 1208000, 861000, 1208000, 861000, 1208000], 0, 0, 95000],
      ["Apr-26", 3390000, 41, 3305000, [648000, 909000, 751000, 963000, 695000, 829000], 0, 0, 40000],
      ["May-26", 3550000, 44, 3461000, [705000, 989000, 817000, 1050000, 757000, 903000], 0, 0, 55000],
      ["Jun-26", 3700000, 46, 3608000, [763000, 1070000, 884000, 1135000, 819000, 977000], 0, 0, 65000],
      ["Jul-26", 3820000, 48, 3722000, [795000, 1115000, 922000, 1184000, 855000, 1020000], 0, 1, 60000],
      ["Aug-26", 3640000, 45, 3549000, [738000, 1035000, 855000, 1099000, 794000, 947000], 0, 0, 50000],
      ["Sep-26", 3880000, 49, 3783000, [828000, 1160000, 959000, 1232000, 890000, 1062000], 0, 0, 75000],
    ].map(([m, cr, n, dr, b, inw, out, cash]) => ({ m, cr, n, dr, b, inw, out, cash })),
  },
  bureau: {
    cibil: 752, cmr: 4, dpd12: 0, dpd24: 0, enq6: 3, wo: "No", overdue: 0,
    loans: [
      { lender: "Bank A", facility: "Term loan (machinery)", sanction: 4500000, outstanding: 2800000, emi: 45000, dpd: 0, close: "No" },
      { lender: "NBFC B", facility: "Commercial vehicle loan", sanction: 900000, outstanding: 420000, emi: 18000, dpd: 0, close: "No" },
      { lender: "Bank A", facility: "Cash credit limit", sanction: 6500000, outstanding: 6500000, emi: 0, dpd: 0, close: "No" },
      { lender: "NBFC C", facility: "Unsecured business loan", sanction: 1000000, outstanding: 150000, emi: 34000, dpd: 0, close: "Yes" },
    ],
  },
  coll: {
    type: "Residential", addr: "Flat 702, Sai Heights, Baner, Pune 411045",
    owner: "Rohan Deshpande", own: "Promoter / co-applicant", area: 1250,
    mv: 9500000, dv: 7600000, valuer: "ABC Valuers (empanelled)",
    vdate: "2026-09-28", legal: "Clear", tech: "Clear",
    charge: "First and exclusive mortgage",
  },
  policy: {
    min_vintage: [3, 3], min_age: [21, 21], max_age: [65, 70], min_cibil: [700, 680],
    max_dpd: [0, 30], max_enq: [6, 8], min_dscr: [1.3, 1.2], max_foir: [60, 70],
    max_tol: [4, 5], min_cr: [1, 1], min_turnover: [5000000, 3000000],
    min_bank_to: [50, 40], max_inward: [3, 4], max_loan: [5000000, 50000000],
    max_tenure: [48, 180], to_pct: [20, 50], abb_mult: [1.5, 1.25],
    base_roi: [15, 10.5], pf: [2, 1],
  },
  ltv: { Residential: 70, Commercial: 60, Industrial: 55, "Open plot": 50 },
};

const POLICY_FIELDS = [
  ["min_vintage", "Min business vintage", "yrs"], ["min_age", "Min promoter age", "yrs"],
  ["max_age", "Max age at maturity", "yrs"], ["min_cibil", "Min bureau score", ""],
  ["max_dpd", "Max DPD, 12 months", "days"], ["max_enq", "Max enquiries, 6 months", ""],
  ["min_dscr", "Min DSCR", "x"], ["max_foir", "Max FOIR", "%"], ["max_tol", "Max TOL/TNW", "x"],
  ["min_cr", "Min current ratio", "x"], ["min_turnover", "Min annual turnover", "₹"],
  ["min_bank_to", "Min bank credits / turnover", "%"], ["max_inward", "Max inward returns, 12m", ""],
  ["max_loan", "Max loan amount", "₹"], ["max_tenure", "Max tenure", "months"],
  ["to_pct", "Turnover method: % of turnover", "%"], ["abb_mult", "ABB / EMI multiple", "x"],
  ["base_roi", "Base ROI, Grade A", "%"], ["pf", "Processing fee", "%"],
];

const clone = (value) => JSON.parse(JSON.stringify(value));
const n = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
const sum = (values) => values.reduce((total, value) => total + n(value), 0);
const money = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format(n(value));
const percent = (value, digits = 1) => `${(n(value) * 100).toFixed(digits)}%`;
const multiple = (value) => `${n(value).toFixed(2)}x`;
const pmt = (rate, months, principal) => !months ? 0 : rate === 0
  ? principal / months
  : principal * rate / (1 - Math.pow(1 + rate, -months));
const pv = (rate, months, payment) => !months ? 0 : rate === 0
  ? payment * months
  : payment * (1 - Math.pow(1 + rate, -months)) / rate;
const yearsBetween = (from, to) => {
  if (!from || !to) return 0;
  const a = new Date(from); const b = new Date(to);
  return Number.isNaN(a.getTime()) || Number.isNaN(b.getTime()) ? 0 : (b - a) / (365.25 * 86400000);
};

function calculateCAM(data) {
  const { profile: p, fin: F, bank: B, bureau: U, coll: C } = data;
  const secured = p.loan_type === "Secured";
  const policyIndex = secured ? 1 : 0;
  const P = {};
  POLICY_FIELDS.forEach(([key, , unit]) => {
    const raw = n(data.policy[key]?.[policyIndex]);
    P[key] = unit === "%" ? raw / 100 : raw;
  });

  const financialYears = [0, 1, 2].map((i) => {
    const get = (key) => n(F[key]?.[i]);
    const row = {};
    row.rev = get("rev");
    row.ti = row.rev + get("oi");
    row.ebitda = row.ti - get("cogs") - get("emp") - get("opex");
    row.pbt = row.ebitda - get("dep") - get("int");
    row.pat = row.pbt - get("tax");
    row.dep = get("dep"); row.int = get("int"); row.cogs = get("cogs");
    row.tl = ["cap", "res", "quasi", "ltb", "stb", "pay", "ocl"].reduce((t, k) => t + get(k), 0);
    row.ta = ["nfa", "invest", "stock", "rec", "cash", "oca"].reduce((t, k) => t + get(k), 0);
    row.chk = row.tl - row.ta;
    row.tnw = get("cap") + get("res") + get("quasi");
    row.tol = row.tl - row.tnw;
    row.tol_tnw = row.tnw ? row.tol / row.tnw : 0;
    row.debt = get("ltb") + get("stb");
    row.ca = get("stock") + get("rec") + get("cash") + get("oca");
    row.cl = get("stb") + get("pay") + get("ocl");
    row.cr = row.cl ? row.ca / row.cl : 0;
    row.ebitda_m = row.rev ? row.ebitda / row.rev : 0;
    row.pat_m = row.rev ? row.pat / row.rev : 0;
    row.dso = row.rev ? get("rec") / row.rev * 365 : 0;
    row.dio = row.cogs ? get("stock") / row.cogs * 365 : 0;
    row.dpo = row.cogs ? get("pay") / row.cogs * 365 : 0;
    row.icr = row.int ? row.ebitda / row.int : 0;
    row.accr = row.pat + row.dep;
    return row;
  });
  financialYears.forEach((row, i) => {
    row.g_rev = i === 0 ? NaN : financialYears[i - 1].rev
      ? row.rev / financialYears[i - 1].rev - 1 : 0;
  });
  const latest = financialYears[2];
  const bankRows = B.rows || [];
  const bankCredits = sum(bankRows.map((row) => row.cr));
  const avgCredits = bankRows.length ? bankCredits / bankRows.length : 0;
  const abb = bankRows.length
    ? bankRows.reduce((total, row) => total + sum(row.b || []) / Math.max((row.b || []).length, 1), 0) / bankRows.length
    : 0;
  const inward = sum(bankRows.map((row) => row.inw));
  const outward = sum(bankRows.map((row) => row.out));
  const cashPct = bankCredits ? sum(bankRows.map((row) => row.cash)) / bankCredits : 0;
  const bankToTurnover = latest.rev ? bankCredits / latest.rev : 0;
  const existingLoans = (U.loans || []).filter((loan) => loan.close !== "Yes");
  const existingEmi = sum(existingLoans.map((loan) => loan.emi));
  const existingOs = sum(existingLoans.map((loan) => loan.os));
  const closeCount = (U.loans || []).filter((loan) => loan.close === "Yes" && (loan.lender || n(loan.os))).length;
  const requested = n(p.loan_amt);
  const months = n(p.tenure);
  const rate = n(p.roi) / 1200;
  const requestedEmi = pmt(rate, months, requested);
  const totalEmi = requestedEmi + existingEmi;
  const dscrIncome = latest.pat + latest.dep + latest.int;
  const dscr = totalEmi ? dscrIncome / (totalEmi * 12) : 0;
  const monthlyIncome = ((financialYears[1].pat + financialYears[1].dep + financialYears[1].int)
    + (latest.pat + latest.dep + latest.int)) / 24;
  const foir = monthlyIncome ? totalEmi / monthlyIncome : 0;
  const abbEmi = requestedEmi ? abb / requestedEmi : 0;
  const ltvNorm = n(data.ltv[C.type]) / 100;
  const collateralEligibility = n(C.mv) * ltvNorm;
  const positive = (v) => Math.max(0, v);
  const methods = [
    ["FOIR method", "Monthly income × max FOIR, less existing EMIs",
      months ? positive(pv(rate, months, monthlyIncome * P.max_foir - existingEmi)) : 0],
    ["DSCR method", "Cash accruals / min DSCR, less existing EMIs",
      months ? positive(pv(rate, months, dscrIncome / P.min_dscr / 12 - existingEmi)) : 0],
    ["Banking (ABB) method", "ABB / required multiple as maximum EMI",
      months ? positive(pv(rate, months, abb / P.abb_mult)) : 0],
    ["Turnover method", "Latest turnover × policy percentage", latest.rev * P.to_pct],
    ["Product cap", "Policy maximum", P.max_loan],
    ["LTV method", "Market value × maximum LTV", secured ? collateralEligibility : null],
  ];
  const applicableMethods = methods.filter((method) => method[2] !== null);
  const eligibility = Math.min(...applicableMethods.map((method) => method[2]));
  const bindingMethod = applicableMethods.find((method) => method[2] === eligibility)?.[0] || "N/A";
  const recommended = Math.min(eligibility, requested);
  const recommendedAmount = recommended < 10000 ? 0 : Math.floor(recommended / 10000) * 10000;
  const recommendedEmi = pmt(rate, months, recommendedAmount);
  const counterOffer = recommendedAmount < requested;
  const ltv = n(C.mv) ? recommendedAmount / n(C.mv) : 0;
  const ownAssets = Number(p.residence === "Owned") + Number(p.premises === "Owned");
  const vintage = yearsBetween(p.start_date, p.cam_date);
  const age = Math.floor(yearsBetween(p.dob, p.cam_date));

  const scoreRows = [
    { label: "Promoter bureau score", value: n(U.cibil), max: 15, display: String(n(U.cibil)), score: n(U.cibil) >= 750 ? 15 : n(U.cibil) >= 725 ? 12 : n(U.cibil) >= 700 ? 9 : n(U.cibil) >= 680 ? 5 : 0 },
    { label: "Business vintage", value: vintage, max: 8, display: `${vintage.toFixed(1)} yrs`, score: vintage >= 10 ? 8 : vintage >= 5 ? 6 : vintage >= 3 ? 4 : 0 },
    { label: "DSCR", value: dscr, max: 15, display: multiple(dscr), score: dscr >= 2 ? 15 : dscr >= 1.5 ? 12 : dscr >= 1.3 ? 9 : dscr >= 1.2 ? 5 : 0 },
    { label: "TOL / TNW", value: latest.tol_tnw, max: 10, display: multiple(latest.tol_tnw), score: latest.tol_tnw <= 1.5 ? 10 : latest.tol_tnw <= 3 ? 7 : latest.tol_tnw <= 4 ? 4 : latest.tol_tnw <= 5 ? 2 : 0 },
    { label: "Current ratio", value: latest.cr, max: 5, display: multiple(latest.cr), score: latest.cr >= 1.33 ? 5 : latest.cr >= 1.1 ? 3 : latest.cr >= 1 ? 1 : 0 },
    { label: "Revenue growth", value: latest.g_rev, max: 5, display: Number.isFinite(latest.g_rev) ? percent(latest.g_rev) : "n/a", score: latest.g_rev >= .15 ? 5 : latest.g_rev >= .05 ? 4 : latest.g_rev >= 0 ? 2 : 0 },
    { label: "PAT margin", value: latest.pat_m, max: 5, display: percent(latest.pat_m), score: latest.pat_m >= .08 ? 5 : latest.pat_m >= .04 ? 3 : latest.pat_m > 0 ? 1 : 0 },
    { label: "ABB / proposed EMI", value: abbEmi, max: 8, display: multiple(abbEmi), score: abbEmi >= 3 ? 8 : abbEmi >= 2 ? 6 : abbEmi >= 1.5 ? 4 : abbEmi >= 1.25 ? 2 : 0 },
    { label: "Industry risk", value: p.ind_risk, max: 5, display: p.ind_risk, score: p.ind_risk === "Low" ? 5 : p.ind_risk === "Medium" ? 3 : 0 },
    { label: "Owned residence / premises", value: ownAssets, max: 4, display: `${ownAssets} of 2`, score: ownAssets === 2 ? 4 : ownAssets === 1 ? 2 : 0 },
  ];
  const score = sum(scoreRows.map((row) => row.score));
  const maxScore = sum(scoreRows.map((row) => row.max));
  const scorePct = maxScore ? score / maxScore : 0;
  const grade = scorePct >= .8 ? "A" : scorePct >= .65 ? "B" : scorePct >= .5 ? "C" : scorePct >= .4 ? "D" : "E";
  const risk = ({ A: "Low", B: "Moderate", C: "Average", D: "High", E: "Very high" })[grade];
  const gradeOffset = ({ A: 0, B: 1, C: 2, D: 3.5, E: null })[grade];
  const recommendedRoi = gradeOffset === null ? null : P.base_roi + gradeOffset / 100;

  const deviations = [];
  const addDeviation = (label, norm, actual, met, severity, applicable = true) => {
    deviations.push({ label, norm: String(norm), actual: String(actual), status: !applicable ? "N/A" : met ? "Met" : "Deviation", severity, applicable });
  };
  addDeviation("Business vintage", P.min_vintage, vintage.toFixed(1), vintage >= P.min_vintage, "Major");
  addDeviation("Promoter minimum age", P.min_age, age, age >= P.min_age, "Minor");
  addDeviation("Promoter age at maturity", P.max_age, (age + months / 12).toFixed(1), age + months / 12 <= P.max_age, "Major");
  addDeviation("Promoter bureau score", P.min_cibil, U.cibil, n(U.cibil) >= P.min_cibil, "Major");
  addDeviation("Max DPD, 12 months", P.max_dpd, U.dpd12, n(U.dpd12) <= P.max_dpd, "Major");
  addDeviation("Written-off / settled history", "No", U.wo, U.wo === "No", "Critical");
  addDeviation("Bureau enquiries, 6 months", P.max_enq, U.enq6, n(U.enq6) <= P.max_enq, "Minor");
  addDeviation("DSCR", P.min_dscr, multiple(dscr), dscr >= P.min_dscr, "Major");
  addDeviation("FOIR", percent(P.max_foir), percent(foir), foir <= P.max_foir, "Major");
  addDeviation("TOL / TNW", P.max_tol, multiple(latest.tol_tnw), latest.tol_tnw <= P.max_tol, "Minor");
  addDeviation("Current ratio", P.min_cr, multiple(latest.cr), latest.cr >= P.min_cr, "Minor");
  addDeviation("Annual turnover", money(P.min_turnover), money(latest.rev), latest.rev >= P.min_turnover, "Major");
  addDeviation("Profit after tax, latest year", "> 0", money(latest.pat), latest.pat > 0, "Major");
  addDeviation("Bank credits / turnover", percent(P.min_bank_to), percent(bankToTurnover), bankToTurnover >= P.min_bank_to, "Minor");
  addDeviation("Inward returns, 12 months", P.max_inward, inward, inward <= P.max_inward, "Minor");
  addDeviation("Loan within product cap", money(P.max_loan), money(requested), requested <= P.max_loan, "Major");
  addDeviation("Tenure (months)", P.max_tenure, months, months <= P.max_tenure, "Minor");
  addDeviation("Industry risk category", "Low / Medium", p.ind_risk, p.ind_risk !== "High", "Minor");
  addDeviation("Financials tally (3 years)", "Tallies", financialYears.every((row) => Math.abs(row.chk) < 1) ? "Tallies" : "Mismatch", financialYears.every((row) => Math.abs(row.chk) < 1), "Critical");
  addDeviation("Collateral LTV", percent(ltvNorm), percent(ltv), ltv <= ltvNorm, "Major", secured);
  addDeviation("Collateral legal title", "Clear", C.legal, C.legal === "Clear", "Critical", secured);
  addDeviation("Collateral technical / valuation", "Clear", C.tech, C.tech === "Clear", "Critical", secured);

  const failed = deviations.filter((row) => row.applicable && row.status === "Deviation");
  const critical = failed.filter((row) => row.severity === "Critical").length;
  const major = failed.filter((row) => row.severity === "Major").length;
  const minor = failed.filter((row) => row.severity === "Minor").length;
  const decision = critical || grade === "E" || recommendedAmount <= 0
    ? "DECLINE"
    : major >= 3 ? "REFER TO CREDIT COMMITTEE"
      : major > 0 ? "APPROVE WITH CONDITIONS"
        : minor > 0 ? "APPROVE (MINOR DEVIATIONS)" : "APPROVE";
  const authority = decision === "DECLINE" ? "Not applicable"
    : major >= 3 ? "Credit Committee"
      : major > 0 ? "Zonal Credit Head"
        : minor > 0 ? "Branch Credit Manager" : "As per delegation of powers";

  const strengths = [];
  const concerns = [];
  const conditions = ["NACH mandate from the primary operative account for EMI repayment.",
    `Personal guarantee of ${p.promoter}${p.guarantors ? ` and ${p.guarantors}` : ""}.`];
  if (dscr >= 1.5) strengths.push(`Comfortable debt servicing: DSCR of ${multiple(dscr)} against a policy minimum of ${multiple(P.min_dscr)}.`);
  if (latest.g_rev >= .1) strengths.push(`Revenue grew ${percent(latest.g_rev, 0)} in ${F.years[2]}.`);
  if (latest.tol_tnw > 0 && latest.tol_tnw <= 2) strengths.push(`Conservative leverage: TOL/TNW of ${multiple(latest.tol_tnw)}.`);
  if (n(U.cibil) >= 750) strengths.push(`Strong promoter bureau score of ${n(U.cibil)}.`);
  if (vintage >= 5) strengths.push(`Established business with ${vintage.toFixed(0)} years of vintage.`);
  if (inward === 0) strengths.push("No inward returns recorded in the last 12 months.");
  if (bankToTurnover >= .8) strengths.push(`Bank credits are ${percent(bankToTurnover, 0)} of reported revenue.`);
  if (dscr < P.min_dscr) concerns.push(`DSCR of ${multiple(dscr)} is below the policy minimum of ${multiple(P.min_dscr)}.`);
  if (foir > P.max_foir) concerns.push(`FOIR of ${percent(foir, 0)} exceeds the policy cap of ${percent(P.max_foir, 0)}.`);
  if (latest.g_rev < 0) concerns.push(`Revenue declined ${percent(-latest.g_rev, 0)} in ${F.years[2]}.`);
  if (latest.tol_tnw > P.max_tol) concerns.push(`High leverage: TOL/TNW of ${multiple(latest.tol_tnw)}.`);
  if (n(U.cibil) < P.min_cibil) concerns.push(`Bureau score is below the policy minimum of ${P.min_cibil}.`);
  if (n(U.dpd12) > 0) concerns.push(`${n(U.dpd12)} DPD recorded in the last 12 months.`);
  if (U.wo === "Yes") concerns.push("Bureau shows written-off or settled history.");
  if (inward > 0) concerns.push(`${inward} inward return(s) require explanation.`);
  if (bankToTurnover < .6) concerns.push(`Bank credits are only ${percent(bankToTurnover, 0)} of reported turnover.`);
  if (latest.cr < 1) concerns.push(`Weak liquidity: current ratio of ${multiple(latest.cr)}.`);
  if (p.premises === "Rented") concerns.push("Business operates from rented premises.");
  if (counterOffer) {
    concerns.push(`Requested amount exceeds assessed eligibility; restricted to ${money(recommendedAmount)} (${bindingMethod}).`);
    conditions.push("Sanction restricted to assessed eligibility; borrower acceptance of the counter-offer required.");
  }
  if (closeCount) conditions.push(`Closure of ${closeCount} existing loan(s), with NOC, before disbursal.`);
  if (secured) {
    conditions.push(`Creation of ${C.charge.toLowerCase()} over ${C.addr} before disbursal.`);
    conditions.push("Property insurance with lender endorsement for the full loan tenure.");
    if (C.legal !== "Clear" || C.tech !== "Clear") concerns.push("Collateral legal or technical clearance is pending.");
  }
  if (inward > 0) conditions.push("Satisfactory explanation for inward returns to be documented.");
  if (F.status.includes("Provisional")) conditions.push("Audited financials for the provisional year to be submitted within 6 months.");
  conditions.push("End-use certificate within 90 days of disbursal; annual review of financials and banking.");

  return {
    secured, policy: P, years: financialYears, vintage, age, latest,
    bankCredits, avgCredits, abb, inward, outward, cashPct, bankToTurnover,
    existingEmi, existingOs, closeCount, requested, months, requestedEmi,
    totalEmi, dscrIncome, dscr, monthlyIncome, foir, abbEmi, ltvNorm,
    collateralEligibility, methods, eligibility, bindingMethod, recommendedAmount,
    recommendedEmi, counterOffer, ltv, scoreRows, score, maxScore, scorePct,
    grade, risk, recommendedRoi, deviations, critical, major, minor,
    decision, authority, strengths, concerns, conditions,
  };
}

function Field({ label, path, value, onChange, type = "text", options, wide = false }) {
  return <label className={`cam-field ${wide ? "cam-wide" : ""}`}>
    <span>{label}</span>
    {options
      ? <select value={value ?? ""} onChange={(e) => onChange(path, e.target.value)}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
      : <input type={type} step={type === "number" ? "any" : undefined}
        value={value ?? ""} onChange={(e) => onChange(path, type === "number" ? n(e.target.value) : e.target.value)} />}
  </label>;
}

function DataTable({ headers, children }) {
  return <div className="cam-table-wrap"><table className="cam-table">
    <thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
    <tbody>{children}</tbody>
  </table></div>;
}

function KeyValues({ items }) {
  return <div className="cam-kv">{items.map(([label, value]) =>
    <div key={label}><span>{label}</span><b>{value ?? "—"}</b></div>)}</div>;
}

export default function BusinessLoanCAM({ initialData, onSave, onSubmit, persist = true }) {
  // console.log("params, ", { initialData, onSave, onSubmit, persist})
  const [data, setData] = useState(() => {
    if (initialData) return clone(initialData);
    if (persist) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch { /* localStorage may be unavailable */ }
    }
    return clone(SAMPLE);
  });
  const [activeTab, setActiveTab] = useState("Profile");
  const [saveState, setSaveState] = useState("idle");
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
  const [submitRemark, setSubmitRemark] = useState("");
  const [submitRemarkError, setSubmitRemarkError] = useState("");
  const result = useMemo(() => calculateCAM(data), [data]);
  const { authData } = useAuthData()
  const navigate = useNavigate()
  const isDecline = result.decision === "DECLINE";
  
    const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customer_id");
  const applicationId = searchParams.get("application_id");

  const handleSubmit = async () => {
    const trimmedRemark = submitRemark.trim();
    if (trimmedRemark.length < 10) {
      setSubmitRemarkError("Remark is required and must be at least 10 characters.");
      return;
    }

    setSubmitRemarkError("");
    setIsSubmittingApplication(true);
    try {
      const payload = {
        customer_id: customerId,
        application_id: applicationId,
        from_step: 3,
        // to_step: 4,
        to_step: isDecline? 8: 4, // 8 -> reject 4-> new leads(LMS)
        role: authData?.role,
        reason: isDecline
          ? "Application rejected as per CAM decision"
          : "Application moved to LMS",
        remark: trimmedRemark,
        created_by: authData?.user_id || "USR_0001",
        company_id: import.meta.env.VITE_COMPANY_ID,
        product_name: import.meta.env.VITE_PRODUCT_NAME,
      };

      const response = await SettingApplicationStep(payload);
      if (!response?.status) {
        toast.info(response?.message || "Error in submitting form!");
        return;
      }

      toast.success(response.message || "Application submitted successfully.");
      setIsSubmitConfirmOpen(false);
      navigate(-1)
    } catch (error) {
      console.error("Failed to submit application:", error);
      showValidationError(error);
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  useEffect(() => {
    if (!persist) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* ignore storage errors */ }
  }, [data, persist]);

  useEffect(() => {
    const fetchCamReport = async () => {
      // request payload
      const requestPayload = {
        application_id: applicationId || "AP_10001",
        customer_id: customerId || "CU_1003",
      };

      try {
        //  API function
        const res = await CAMREPORT(requestPayload);

        if (res?.status || res?.data?.success) {
          console.log("CAM Report fetched successfully:", res);
          const profile = res?.data?.profile;
          const bureau = res?.data?.profile?.bureau;
          const collateral = res?.data?.profile?.collateral?.[0];
          const policy = res?.data?.profile?.policy;
          const banking = res?.data?.profile?.banking;

          setData(() => {
            return {
              ...SAMPLE,
              profile: {
                cam_date: profile?.cam_date,
                branch: profile?.branch,
                rm: "R. Kulkarni",
                analyst: profile?.credit_analyst,
                name: profile?.applicant_name,
                constitution: profile?.constitution,
                pan: profile?.pan,
                gstin: profile?.gstin,
                industry: "Manufacturer of CNC-machined auto components (Tier-2 OEM supplier)",
                ind_risk: "Medium",
                start_date: profile?.business_start_date,
                premises: profile?.business_premises,
                address: profile?.business_address,
                promoter: profile?.key_promoter,
                dob: profile?.promoter_dob,
                residence: profile?.residence,
                experience: profile?.experience_in_line,
                guarantors: profile?.guarantors,
                loan_type: "Unsecured",
                loan_amt: profile?.amount_requested,
                tenure: profile?.tenure_in_months,
                roi: profile?.roi,
                purpose: profile?.purposed_roi,
                repay: "Monthly EMI via NACH",
              },
              bureau: {
                cibil: bureau?.cibil, cmr: bureau?.cmr, dpd12: bureau?.dpd12, dpd24: bureau?.dpd24, enq6: bureau?.enq6, wo: bureau?.wo, overdue: bureau?.overdue,
                loans: bureau?.loans,
              },
              coll: {
                type: collateral?.property_type, addr: collateral?.address,
                owner: collateral?.owner, own: collateral?.ownership, area: collateral?.area_sqft,
                mv: collateral?.market_value, dv: collateral?.distress_value, valuer: "ABC Valuers (empanelled)",
                vdate: "", legal: collateral?.legal_title, tech: collateral?.technical_status,
                charge: collateral?.charge,
              },
              policy: {
                min_vintage: [policy?.min_vintage, 3],
                min_age: [policy?.min_age, 21],
                max_age: [policy?.max_age, 70],
                min_cibil: [policy?.min_cibil, 680],
                max_dpd: [policy?.max_dpd, 30],
                max_enq: [policy?.max_enq, 8],
                min_dscr: [policy?.min_dscr, 1.2],
                max_foir: [policy?.max_foir, 70],
                max_tol: [policy?.max_tol, 5],
                min_cr: [policy?.min_cr, 1],
                min_turnover: [policy?.min_turnover, 3000000],
                min_bank_to: [policy?.min_bank_to, 40],
                max_inward: [policy?.max_inward, 4],
                max_loan: [policy?.max_loan, 50000000],
                max_tenure: [policy?.max_tenure, 180],
                to_pct: [policy?.to_pct, 50],
                abb_mult: [policy?.abb_mult, 1.25],
                base_roi: [policy?.base_roi, 10.5],
                pf: [policy?.pf, 1],
              },
              bank: {
                acct: banking?.account,
                rows: banking?.rows?.map((row) => ({
                  m: row.month,
                  cr: row.credits,
                  n: row.credit_count,
                  dr: row.debits,
                  b: [
                    row.balance_5th, row.balance_10th, row.balance_15th,
                    row.balance_20th, row.balance_25th, row.balance_month_end
                  ],
                  inw: row.inward_returns,
                  out: row.outward_returns,
                  cash: row.cash_deposit
                })),
              },

            }
          })
        } else {
          console.warn("API returned an unsuccessful status:", res?.message);
        }
      } catch (error) {
        console.error("Error fetching CAM report:", error);
      }
    };

    fetchCamReport();
  }, []);


  const update = (path, value) => {
    setData((current) => {
      const next = clone(current);
      const keys = path.split(".");
      let target = next;
      keys.slice(0, -1).forEach((key) => { target = target[key]; });
      target[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const makePayload = () => ({
    ...clone(data),
    meta: {
      document_type: "BUSINESS_LOAN_CAM",
      schema_version: 1,
      generated_at: new Date().toISOString(),
    },
    calculated: {
      loan_type: data.profile.loan_type,
      requested_amount: result.requested,
      recommended_amount: result.recommendedAmount,
      recommended_emi: result.recommendedEmi,
      requested_emi: result.requestedEmi,
      dscr: result.dscr,
      foir: result.foir,
      eligibility: result.eligibility,
      binding_method: result.bindingMethod,
      risk_grade: result.grade,
      risk_level: result.risk,
      score: result.score,
      max_score: result.maxScore,
      decision: result.decision,
      sanctioning_authority: result.authority,
      policy_deviations: result.deviations,
    },
  });

  const handleSave = async () => {
    const payload = makePayload();
    try {
      setSaveState("saving");
      if (onSave) await onSave(payload);
      else if (onSubmit) await onSubmit(payload);
      else {
        await navigator.clipboard?.writeText(JSON.stringify(payload, null, 2));
      }
      setSaveState("saved");
    } catch (error) {
      console.error("Unable to submit CAM payload:", error);
      setSaveState("error");
    }
  };

  const resetSample = () => { setData(clone(SAMPLE)); setActiveTab("Profile"); setSaveState("idle"); };
  const blankCase = () => {
    const blank = clone(SAMPLE);
    Object.keys(blank.fin).forEach((key) => {
      if (Array.isArray(blank.fin[key]) && key !== "years" && key !== "status") blank.fin[key] = blank.fin[key].map(() => 0);
    });
    blank.bank.rows.forEach((row) => { row.cr = row.n = row.dr = row.inw = row.out = row.cash = 0; row.b = row.b.map(() => 0); });
    blank.bureau.cibil = blank.bureau.cmr = blank.bureau.dpd12 = blank.bureau.dpd24 = blank.bureau.enq6 = blank.bureau.overdue = 0;
    blank.bureau.loans = [{ lender: "", facility: "", sanction: 0, outstanding: 0, emi: 0, dpd: 0, close: "No" }];
    blank.coll.mv = blank.coll.dv = blank.coll.area = 0;
    Object.assign(blank.profile, { name: "New applicant", pan: "", gstin: "", industry: "", address: "", promoter: "", guarantors: "", purpose: "", loan_amt: 0, experience: 0 });
    setData(blank); setActiveTab("Profile"); setSaveState("idle");
  };

  const addLoan = () => update("bureau.loans", [...data.bureau.loans, { lender: "", facility: "", sanction: 0, outstanding: 0, emi: 0, dpd: 0, close: "No" }]);
  const updateLoan = (index, key, value) => update(`bureau.loans.${index}.${key}`, value);
  const removeLoan = (index) => update("bureau.loans", data.bureau.loans.filter((_, i) => i !== index));

  const renderProfile = () => <div className="cam-form-grid">
    <h3>CAM details</h3>
    <Field label="Date of CAM" path="profile.cam_date" type="date" value={data.profile.cam_date} onChange={update} />
    <Field label="Branch" path="profile.branch" value={data.profile.branch} onChange={update} />
    <Field label="Sourcing RM" path="profile.rm" value={data.profile.rm} onChange={update} />
    <Field label="Credit analyst" path="profile.analyst" value={data.profile.analyst} onChange={update} />
    <h3>Borrower</h3>
    <Field label="Applicant name" path="profile.name" value={data.profile.name} onChange={update} wide />
    <Field label="Constitution" path="profile.constitution" value={data.profile.constitution} onChange={update} options={["Proprietorship", "Partnership", "LLP", "Private Limited Company", "Public Limited Company"]} />
    <Field label="PAN" path="profile.pan" value={data.profile.pan} onChange={update} />
    <Field label="GSTIN" path="profile.gstin" value={data.profile.gstin} onChange={update} />
    <Field label="Nature of business" path="profile.industry" value={data.profile.industry} onChange={update} wide />
    <Field label="Industry risk" path="profile.ind_risk" value={data.profile.ind_risk} onChange={update} options={["Low", "Medium", "High"]} />
    <Field label="Business start date" path="profile.start_date" type="date" value={data.profile.start_date} onChange={update} />
    <Field label="Business premises" path="profile.premises" value={data.profile.premises} onChange={update} options={["Owned", "Rented"]} />
    <Field label="Business address" path="profile.address" value={data.profile.address} onChange={update} wide />
    <h3>Promoter</h3>
    <Field label="Key promoter" path="profile.promoter" value={data.profile.promoter} onChange={update} />
    <Field label="Date of birth" path="profile.dob" type="date" value={data.profile.dob} onChange={update} />
    <Field label="Residence" path="profile.residence" value={data.profile.residence} onChange={update} options={["Owned", "Rented"]} />
    <Field label="Experience in line (yrs)" path="profile.experience" type="number" value={data.profile.experience} onChange={update} />
    <Field label="Co-applicants / guarantors" path="profile.guarantors" value={data.profile.guarantors} onChange={update} wide />
    <h3>Loan request</h3>
    <Field label="Amount requested (₹)" path="profile.loan_amt" type="number" value={data.profile.loan_amt} onChange={update} />
    <Field label="Tenure (months)" path="profile.tenure" type="number" value={data.profile.tenure} onChange={update} />
    <Field label="Proposed ROI (% p.a.)" path="profile.roi" type="number" value={data.profile.roi} onChange={update} />
    <Field label="End use" path="profile.purpose" value={data.profile.purpose} onChange={update} wide />
    <Field label="Repayment mode" path="profile.repay" value={data.profile.repay} onChange={update} wide />
  </div>;

  const renderFinancials = () => {
    const fields = [
      ["rev", "Revenue"], ["oi", "Other income"], ["cogs", "Cost of materials"], ["emp", "Employee costs"],
      ["opex", "Other operating expenses"], ["dep", "Depreciation"], ["int", "Interest"], ["tax", "Tax"],
      ["cap", "Capital"], ["res", "Reserves & surplus"], ["quasi", "Promoter loans (quasi-equity)"],
      ["ltb", "Long-term borrowings"], ["stb", "Short-term borrowings"], ["pay", "Trade payables"], ["ocl", "Other current liabilities"],
      ["nfa", "Net fixed assets"], ["invest", "Investments"], ["stock", "Inventory"], ["rec", "Trade receivables"],
      ["cash", "Cash & bank"], ["oca", "Other current assets"],
    ];
    return <div>
      <div className="cam-fin-year-row"><b>Particulars</b>{data.fin.years.map((year, i) =>
        <input key={i} value={year} onChange={(e) => update(`fin.years.${i}`, e.target.value)} aria-label={`Financial year ${i + 1}`} />)}</div>
      <div className="cam-fin-year-row"><b>Status</b>{data.fin.status.map((status, i) =>
        <select key={i} value={status} onChange={(e) => update(`fin.status.${i}`, e.target.value)}>
          {["Audited", "Provisional", "Projected"].map((v) => <option key={v}>{v}</option>)}
        </select>)}</div>
      <DataTable headers={["Particulars", ...data.fin.years]}>
        {fields.map(([key, label]) => <tr key={key}><td>{label}</td>{[0, 1, 2].map((i) =>
          <td key={i}><input className="cam-number" type="number" value={data.fin[key][i]} onChange={(e) => update(`fin.${key}.${i}`, n(e.target.value))} /></td>)}</tr>)}
        {[
          ["EBITDA", (r) => money(r.ebitda)], ["PAT", (r) => money(r.pat)],
          ["Total liabilities", (r) => money(r.tl)], ["Total assets", (r) => money(r.ta)],
          ["Balance check (must be 0)", (r) => money(r.chk)],
        ].map(([label, getter]) => <tr className="cam-total-row" key={label}><td>{label}</td>{result.years.map((row, i) => <td key={i}>{getter(row)}</td>)}</tr>)}
      </DataTable>
      <p className="cam-note">Enter values in ₹. Latest financial year should be in the last column.</p>
    </div>;
  };

  const renderBanking = () => <div>
    <Field label="Bank / account" path="bank.acct" value={data.bank.acct} onChange={update} wide />
    <DataTable headers={["Month", "Credits", "No. cr", "Debits", "Bal 5th", "Bal 10th", "Bal 15th", "Bal 20th", "Bal 25th", "Month-end", "Inward ret.", "Outward ret.", "Cash dep."]}>
      {data.bank.rows.map((row, i) => <tr key={`${row.m}-${i}`}>
        <td><input value={row.m} onChange={(e) => update(`bank.rows.${i}.m`, e.target.value)} /></td>
        {["cr", "n", "dr"].map((key) => <td key={key}><input type="number" className="cam-number" value={row[key]} onChange={(e) => update(`bank.rows.${i}.${key}`, n(e.target.value))} /></td>)}
        {row.b.map((balance, j) => <td key={j}><input type="number" className="cam-number" value={balance} onChange={(e) => update(`bank.rows.${i}.b.${j}`, n(e.target.value))} /></td>)}
        {["inw", "out", "cash"].map((key) => <td key={key}><input type="number" className="cam-number" value={row[key]} onChange={(e) => update(`bank.rows.${i}.${key}`, n(e.target.value))} /></td>)}
      </tr>)}
    </DataTable>
    <p className="cam-note">ABB is calculated as the average of the six dated balances for each month.</p>
  </div>;

  const renderBureau = () => <div className="cam-form-grid">
    <h3>Bureau summary</h3>
    {[
      ["cibil", "Promoter bureau score"], ["cmr", "Commercial CMR rank (1-10)"],
      ["dpd12", "Max DPD, 12 months"], ["dpd24", "Max DPD, 24 months"],
      ["enq6", "Enquiries, 6 months"], ["overdue", "Current overdue (₹)"],
    ].map(([key, label]) => <Field key={key} label={label} path={`bureau.${key}`} type="number" value={data.bureau[key]} onChange={update} />)}
    <Field label="Written-off / settled" path="bureau.wo" value={data.bureau.wo} onChange={update} options={["No", "Yes"]} />
    <h3>Existing loans</h3>
    <div className="cam-wide">
      <DataTable headers={["Lender", "Facility", "Sanctioned", "Outstanding", "EMI", "DPD", "Close?", ""]}>
        {data.bureau.loans.map((loan, i) => <tr key={i}>
          {["lender", "facility"].map((key) => <td key={key}><input value={loan[key]} onChange={(e) => updateLoan(i, key, e.target.value)} /></td>)}
          {["sanction", "outstanding", "emi", "dpd"].map((key) => <td key={key}><input type="number" className="cam-number" value={loan[key] || 0} onChange={(e) => updateLoan(i, key, n(e.target.value))} /></td>)}
          <td><select value={loan.close} onChange={(e) => updateLoan(i, "close", e.target.value)}><option>No</option><option>Yes</option></select></td>
          <td><button type="button" className="cam-btn" onClick={() => removeLoan(i)}>Remove</button></td>
        </tr>)}
      </DataTable>
      <button type="button" className="cam-btn" onClick={addLoan}>+ Add loan</button>
    </div>
  </div>;

  const renderCollateral = () => <div className="cam-form-grid">
    {!result.secured && <p className="cam-note cam-wide">Loan type is Unsecured, so collateral is ignored in eligibility.</p>}
    <Field label="Property type" path="coll.type" value={data.coll.type} onChange={update} options={Object.keys(data.ltv)} />
    <Field label="Address" path="coll.addr" value={data.coll.addr} onChange={update} wide />
    <Field label="Owner(s)" path="coll.owner" value={data.coll.owner} onChange={update} />
    <Field label="Ownership" path="coll.own" value={data.coll.own} onChange={update} options={["Applicant entity", "Promoter / co-applicant", "Third party"]} />
    <Field label="Area (sq ft)" path="coll.area" type="number" value={data.coll.area} onChange={update} />
    <Field label="Market value (₹)" path="coll.mv" type="number" value={data.coll.mv} onChange={update} />
    <Field label="Distress value (₹)" path="coll.dv" type="number" value={data.coll.dv} onChange={update} />
    <Field label="Valuer" path="coll.valuer" value={data.coll.valuer} onChange={update} />
    <Field label="Valuation date" path="coll.vdate" type="date" value={data.coll.vdate} onChange={update} />
    <Field label="Legal title" path="coll.legal" value={data.coll.legal} onChange={update} options={["Clear", "Not clear", "Pending"]} />
    <Field label="Technical / valuation" path="coll.tech" value={data.coll.tech} onChange={update} options={["Clear", "Not clear", "Pending"]} />
    <Field label="Charge to be created" path="coll.charge" value={data.coll.charge} onChange={update} wide />
  </div>;

  const renderPolicy = () => <div>
    <p className="cam-note">Sample norms only. Replace them with your institution's approved credit policy before production use.</p>
    <DataTable headers={["Policy norm", "Unsecured", "Secured"]}>
      {POLICY_FIELDS.map(([key, label, unit]) => <tr key={key}><td>{label} {unit ? `(${unit})` : ""}</td>
        {[0, 1].map((i) => <td key={i}><input type="number" className="cam-number" value={data.policy[key][i]} onChange={(e) => update(`policy.${key}.${i}`, n(e.target.value))} /></td>)}
      </tr>)}
    </DataTable>
    <h3>Max LTV by property type (%)</h3>
    <div className="cam-form-grid">{Object.keys(data.ltv).map((key) =>
      <Field key={key} label={key} path={`ltv.${key}`} type="number" value={data.ltv[key]} onChange={update} />)}</div>
  </div>;

  const renderMemo = () => <div className="cam-memo">
    <header className="cam-memo-header">
      <div><div className="cam-eyebrow">Credit Appraisal Memorandum · {data.profile.loan_type} business loan</div>
        <h2>{data.profile.name || "New applicant"}</h2></div>
      <div className="cam-muted cam-meta">CAM date: {data.profile.cam_date || "—"}<br />{data.profile.branch} · Analyst {data.profile.analyst}</div>
    </header>
    <div className={`cam-verdict ${result.decision === "DECLINE" ? "is-bad" : result.decision.startsWith("REFER") ? "is-warn" : "is-good"}`}>
      <div><strong>{result.decision}</strong><p>{result.score}/{result.maxScore} score · Grade {result.grade} · {result.risk} risk</p></div>
      <div className="cam-meta">Sanctioning authority<br /><b>{result.authority}</b></div>
      <p className="cam-verdict-reason">{result.critical} critical, {result.major} major and {result.minor} minor deviation(s); eligibility capped by {result.bindingMethod}.</p>
    </div>
    <div className="cam-terms">
      {[
        ["Requested", money(result.requested)], ["Recommended", result.decision === "DECLINE" ? "—" : money(result.recommendedAmount)],
        ["Tenure", `${result.months} months`], ["Risk-based ROI", result.recommendedRoi == null || result.decision === "DECLINE" ? "—" : `${(result.recommendedRoi * 100).toFixed(2)}% p.a.`],
        ["Recommended EMI", result.decision === "DECLINE" ? "—" : money(result.recommendedEmi)],
        ["Processing fee", result.decision === "DECLINE" ? "—" : money(result.recommendedAmount * result.policy.pf)],
        ["Risk grade", `${result.grade} · ${result.risk}`], ["Score", `${result.score} / ${result.maxScore}`],
      ].map(([label, value]) => <div key={label}><span>{label}</span><b>{value}</b></div>)}
    </div>

    <section><h3>01 · Borrower and proposal</h3><KeyValues items={[
      ["Constitution", data.profile.constitution], ["PAN / GSTIN", `${data.profile.pan} / ${data.profile.gstin}`],
      ["Nature of business", data.profile.industry], ["Industry risk", data.profile.ind_risk],
      ["Business vintage", `${result.vintage.toFixed(1)} years`], ["Key promoter", data.profile.promoter],
      ["Age / experience", `${result.age} yrs / ${data.profile.experience} yrs`],
      ["Residence", data.profile.residence], ["Business premises", data.profile.premises],
      ["Co-applicants / guarantors", data.profile.guarantors], ["End use", data.profile.purpose],
      ["Sourcing RM", data.profile.rm], ["Repayment", data.profile.repay],
    ]} /></section>

    <section><h3>02 · Financial summary</h3><DataTable headers={["Particulars", ...data.fin.years]}>
      {[
        ["Revenue", "rev", money], ["EBITDA", "ebitda", money], ["PAT", "pat", money],
        ["Cash accruals", "accr", money], ["Tangible net worth", "tnw", money],
        ["Total borrowings", "debt", money], ["Revenue growth", "g_rev", (v) => Number.isFinite(v) ? percent(v) : "n/a"],
        ["EBITDA margin", "ebitda_m", percent], ["PAT margin", "pat_m", percent],
        ["TOL / TNW", "tol_tnw", multiple], ["Current ratio", "cr", multiple],
        ["Interest coverage", "icr", multiple],
      ].map(([label, key, formatter]) => <tr key={key}><td>{label}</td>{result.years.map((row, i) =>
        <td key={i}>{formatter(row[key])}</td>)}</tr>)}
      <tr><td>Debtor / inventory / creditor days</td>{result.years.map((row, i) =>
        <td key={i}>{`${row.dso.toFixed(0)} / ${row.dio.toFixed(0)} / ${row.dpo.toFixed(0)}`}</td>)}</tr>
    </DataTable></section>

    <section><h3>03 · Repayment capacity and eligibility</h3>
      <KeyValues items={[
        ["Proposed EMI (requested)", money(result.requestedEmi)], ["Continuing existing EMIs", money(result.existingEmi)],
        ["DSCR", multiple(result.dscr)], ["FOIR", percent(result.foir)],
        ["ABB / proposed EMI", multiple(result.abbEmi)], ["Income for DSCR, latest FY", money(result.dscrIncome)],
      ]} />
      <DataTable headers={["Method", "Basis", "Maximum loan"]}>
        {result.methods.map(([name, basis, amount]) => <tr key={name} className={name === result.bindingMethod ? "cam-binding" : ""}>
          <td>{name}</td><td>{basis}</td><td>{amount == null ? "N/A" : money(amount)}</td>
        </tr>)}
        <tr className="cam-total-row"><td colSpan="2">Assessed eligibility · {result.bindingMethod}</td><td>{money(result.eligibility)}</td></tr>
      </DataTable>
    </section>

    <div className="cam-two-col">
      <section><h3>04 · Banking, 12 months</h3><KeyValues items={[
        ["Total credits", money(result.bankCredits)], ["Average monthly credits", money(result.avgCredits)],
        ["Average bank balance", money(result.abb)], ["Credits / reported turnover", percent(result.bankToTurnover)],
        ["Inward / outward returns", `${result.inward} / ${result.outward}`],
        ["Cash deposits, % of credits", percent(result.cashPct)],
      ]} /></section>
      <section><h3>05 · Bureau</h3><KeyValues items={[
        ["Promoter bureau score", data.bureau.cibil], ["Commercial CMR rank", data.bureau.cmr],
        ["Max DPD 12m / 24m", `${data.bureau.dpd12} / ${data.bureau.dpd24}`],
        ["Enquiries, 6 months", data.bureau.enq6], ["Written-off / settled", data.bureau.wo],
        ["Current overdue", money(data.bureau.overdue)],
        ["Continuing EMIs / outstanding", `${money(result.existingEmi)} / ${money(result.existingOs)}`],
      ]} /></section>
    </div>

    <section><h3>06 · Collateral</h3>{result.secured ? <KeyValues items={[
      ["Property", `${data.coll.type}: ${data.coll.addr}`], ["Owner", `${data.coll.owner} (${data.coll.own})`],
      ["Market value", money(data.coll.mv)], ["Distress value", money(data.coll.dv)],
      ["LTV on recommended / policy max", `${percent(result.ltv, 0)} / ${percent(result.ltvNorm, 0)}`],
      ["Security cover", multiple(result.recommendedAmount ? n(data.coll.mv) / result.recommendedAmount : 0)],
      ["Legal title", data.coll.legal], ["Technical / valuation", data.coll.tech],
      ["Valuer", `${data.coll.valuer}, ${data.coll.vdate}`],
    ]} /> : <p className="cam-muted">Not applicable: unsecured loan.</p>}</section>

    <section><h3>07 · Risk scorecard</h3><DataTable headers={["Parameter", "Actual", "Score"]}>
      {result.scoreRows.map((row) => <tr key={row.label}><td>{row.label}</td><td>{row.display}</td><td>{row.score} / {row.max}</td></tr>)}
      <tr className="cam-total-row"><td>Total · Grade {result.grade}</td><td>{percent(result.scorePct, 0)}</td><td>{result.score} / {result.maxScore}</td></tr>
    </DataTable></section>

    <div className="cam-two-col">
      <section><h3>08 · Key strengths</h3>{result.strengths.length ? <ol>{result.strengths.map((item) => <li key={item}>{item}</li>)}</ol> : <p className="cam-muted">None identified.</p>}</section>
      <section><h3>09 · Key risks and concerns</h3>{result.concerns.length ? <ol>{result.concerns.map((item) => <li key={item}>{item}</li>)}</ol> : <p className="cam-muted">None identified.</p>}</section>
    </div>

    <section><h3>10 · Policy deviations</h3>
      {result.deviations.some((row) => row.status === "Deviation" && row.applicable) ? <DataTable headers={["Check", "Norm", "Actual", "Severity"]}>
        {result.deviations.filter((row) => row.status === "Deviation" && row.applicable).map((row) =>
          <tr key={row.label}><td>{row.label}</td><td>{row.norm}</td><td>{row.actual}</td><td>{row.severity}</td></tr>)}
      </DataTable> : <p className="cam-muted">No deviations recorded by the configured checks.</p>}
    </section>

    <section><h3>11 · Conditions of sanction</h3><ol>{result.conditions.map((item, i) => <li key={`${item}-${i}`}>{item}</li>)}</ol></section>
    <section><h3>12 · Sign-off</h3><div className="cam-signatures">
      <div><b>{data.profile.analyst || " "}</b><span>Prepared by, credit analyst</span></div>
      <div><b>&nbsp;</b><span>Reviewed by</span></div>
      {/* <div><b>{result.authority}</b><span>Sanctioning authority</span></div> */}
      <div><b>&nbsp;</b><span>Sanctioning authority</span></div>
    </div></section>
    <p className="cam-disclaimer">Policy norms, score bands, LTV caps and pricing are illustrative samples. Replace them with your institution's approved credit policy before live use. Final credit decision rests with the sanctioning authority.</p>
  </div>;

  return <main className="cam-app">
    <div className="cam-toolbar">
      <div><h1>Business Loan CAM</h1><p>Credit appraisal memo, generated live from the inputs</p></div>
      <div className="cam-segment">
        {["Unsecured", "Secured"].map((type) => <button key={type} type="button"
          aria-pressed={data.profile.loan_type === type}
          onClick={() => update("profile.loan_type", type)}>{type}</button>)}
      </div>
      <span className={`cam-pill ${result.decision === "DECLINE" ? "bad" : result.decision.startsWith("REFER") ? "warn" : "good"}`}>{result.decision}</span>
      <div className="cam-toolbar-spacer" />
      <button className="cam-btn" type="button" onClick={resetSample}>Reload sample case</button>
      <button className="cam-btn" type="button" onClick={blankCase}>Blank case</button>
      {/* <button className="cam-btn primary" type="button" onClick={handleSave}>{saveState === "saving" ? "Preparing..." : "Prepare / Save payload"}</button> */}
      {/* {saveState === "saved" && <span className="cam-save-message">Payload submitted/prepared.</span>} */}
      {saveState === "error" && <span className="cam-save-error">Could not submit payload.</span>}
    </div>
    <div className="cam-layout">
      <aside className="cam-workbench">
        <nav className="cam-tabs" role="tablist">
          {["Profile", "Financials", "Banking", "Bureau", "Collateral", "Policy"].map((name) =>
            <button key={name} type="button" role="tab" aria-selected={activeTab === name}
              onClick={() => setActiveTab(name)}>{name}</button>)}
        </nav>
        <div className="cam-pane">
          {activeTab === "Profile" && renderProfile()}
          {activeTab === "Financials" && renderFinancials()}
          {activeTab === "Banking" && renderBanking()}
          {activeTab === "Bureau" && renderBureau()}
          {activeTab === "Collateral" && renderCollateral()}
          {activeTab === "Policy" && renderPolicy()}
        </div>
      </aside>
      {renderMemo()}
    </div>
    {/* ------------------------------------------------
          Submit
      ------------------------------------------------ */}
    {/* <div className="mt-4 flex justify-end">
      <button
        type="button"
        onClick={() => setIsSubmitConfirmOpen(true)}
        className="bg-primary hover:bg-primary-800 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
      >
        Submit Application
      </button>
      <button
        type="button"
        onClick={() => setIsSubmitConfirmOpen(true)}
        className={`${isDecline
          ? "bg-rose-600 hover:bg-rose-700"
          : "bg-primary hover:bg-primary-800"
          } text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors`}
      >
        {isDecline ? "Reject Application" : "Submit Application"}
      </button>
    </div> */}

    <Modal
      isOpen={isSubmitConfirmOpen}
      onClose={() => {
        if (!isSubmittingApplication) setIsSubmitConfirmOpen(false);
      }}
      title={isDecline ? "Confirm application rejection" : "Confirm application submission"}
      size="sm"
    >
      <div className="space-y-4 p-5">
        <p className="text-sm text-ink-600">
          {isDecline
            ? "The CAM verdict is DECLINE. Are you sure you want to reject this application?"
            : "Are you sure you want to submit this Business Loan CAM and move the application to LMS?"}
        </p>
        <div>
          <label
            htmlFor="cam-submit-remark"
            className="mb-1.5 block text-sm font-medium text-ink-800"
          >
            Remark <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="cam-submit-remark"
            rows={4}
            value={submitRemark}
            onChange={(event) => {
              const value = event.target.value;
              setSubmitRemark(value);
              if (value.trim().length >= 10) setSubmitRemarkError("");
            }}
            onBlur={() => {
              if (submitRemark.trim().length < 10) {
                setSubmitRemarkError(
                  "Remark is required and must be at least 10 characters.",
                );
              }
            }}
            aria-invalid={Boolean(submitRemarkError)}
            aria-describedby={
              submitRemarkError ? "cam-submit-remark-error" : undefined
            }
            placeholder="Enter a remark (minimum 10 characters)"
            disabled={isSubmittingApplication}
            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-ink-900 outline-none focus:ring-2 ${submitRemarkError
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
              : "border-ink-200 focus:border-primary-500 focus:ring-primary-100"
              }`}
          />
          {submitRemarkError && (
            <p
              id="cam-submit-remark-error"
              className="mt-1.5 text-xs text-rose-600"
              role="alert"
            >
              {submitRemarkError}
            </p>
          )}
        </div>
        <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
          <button
            type="button"
            onClick={() => {
              setIsSubmitConfirmOpen(false);
              setSubmitRemarkError("");
            }}
            disabled={isSubmittingApplication}
            className="rounded-lg border border-ink-200 px-4 py-2.5 text-sm font-semibold text-ink-600 hover:bg-ink-50 disabled:opacity-60"
          >
            No, go back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmittingApplication}
            className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 ${isDecline
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-primary-700 hover:bg-primary-800"
              }`}
          >
            {isSubmittingApplication
              ? isDecline
                ? "Rejecting..."
                : "Submitting..."
              : isDecline
                ? "Yes, reject"
                : "Yes, submit"}
          </button>
        </div>
      </div>
    </Modal>
  </main>;
}
