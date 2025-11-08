import React, { useState } from 'react'

function isPositiveNumber(v: string) {
  const n = Number(v)
  return Number.isFinite(n) && n > 0
}

function toNumber(v: string) {
  const n = Number(v)
  return Number.isFinite(n) ? n : NaN
}

export default function App() {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [monthlySalary, setMonthlySalary] = useState('')
  const [existingEmi, setExistingEmi] = useState('')
  const [loanAmount, setLoanAmount] = useState('')

  const [result, setResult] = useState<{ eligible: boolean; reasons: string[]; dti?: number } | null>(null)

  const handleCheck = () => {
    const reasons: string[] = []

    if (!name.trim()) reasons.push('Name is required')

    const ageNum = Number(age)
    if (!Number.isInteger(ageNum) || ageNum < 21 || ageNum > 60) {
      reasons.push('Age must be an integer between 21 and 60')
    }

    if (!isPositiveNumber(monthlySalary)) reasons.push('Monthly Salary must be a positive number')
    if (!isPositiveNumber(existingEmi) && Number(existingEmi) !== 0) reasons.push('Existing EMI/Debts must be zero or a positive number')
    if (!isPositiveNumber(loanAmount)) reasons.push('Loan Amount Requested must be a positive number')

    const sal = toNumber(monthlySalary)
    const emi = toNumber(existingEmi)
    const loan = toNumber(loanAmount)

    let dti: number | undefined = undefined
    if (Number.isFinite(sal) && sal > 0 && Number.isFinite(emi)) {
      dti = (emi / sal) * 100
      if (dti > 60) reasons.push('Debt-to-Income Ratio (DTI) must not exceed 60%')
    }

    if (Number.isFinite(sal) && Number.isFinite(loan)) {
      const cap = sal * 10
      if (loan > cap) reasons.push('Requested loan amount must be ≤ 10 × Monthly Salary')
    }

    setResult({ eligible: reasons.length === 0, reasons, dti })
  }

  const reset = () => {
    setName('')
    setAge('')
    setMonthlySalary('')
    setExistingEmi('')
    setLoanAmount('')
    setResult(null)
  }

  return (
    <div className="container py-4">
      <h1 className="mb-3">Loan Eligibility Checker</h1>
      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Name</label>
                  <input className="form-control" type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="col-6">
                  <label className="form-label">Age</label>
                  <input className="form-control" type="number" min={18} max={99} placeholder="21–60" value={age} onChange={(e) => setAge(e.target.value)} />
                </div>
                <div className="col-6">
                  <label className="form-label">Monthly Salary</label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input className="form-control" type="number" min={0} step="0.01" placeholder="e.g. 50000" value={monthlySalary} onChange={(e) => setMonthlySalary(e.target.value)} />
                  </div>
                </div>
                <div className="col-6">
                  <label className="form-label">Existing EMI/Debts</label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input className="form-control" type="number" min={0} step="0.01" placeholder="e.g. 10000" value={existingEmi} onChange={(e) => setExistingEmi(e.target.value)} />
                  </div>
                </div>
                <div className="col-6">
                  <label className="form-label">Loan Amount Requested</label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input className="form-control" type="number" min={0} step="0.01" placeholder="e.g. 300000" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="d-flex gap-2 mt-4">
                <button className="btn btn-primary" onClick={handleCheck}>Check Eligibility</button>
                <button className="btn btn-outline-secondary" onClick={reset}>Reset</button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Result</h5>
              {!result && <p className="text-muted mb-0">Enter details and click "Check Eligibility".</p>}
              {result && (
                <div>
                  <p className={result.eligible ? 'fw-bold text-success' : 'fw-bold text-danger'}>
                    {result.eligible ? 'Eligible' : 'Not Eligible'}
                  </p>
                  {typeof result.dti === 'number' && (
                    <p className="mb-2">DTI: {result.dti.toFixed(2)}%</p>
                  )}
                  {!result.eligible && result.reasons.length > 0 && (
                    <ul className="mb-0">
                      {result.reasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <p className="text-muted mt-3 small mb-0">Rules: DTI ≤ 60%. Age 21–60. Loan ≤ 10 × Monthly Salary.</p>
    </div>
  )
}
