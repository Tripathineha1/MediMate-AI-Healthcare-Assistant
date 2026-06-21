import React from "react";
import { jsPDF } from "jspdf";

function parseBold(text) {
    if (typeof text !== 'string') return text;
    const standardParts = text.split(/\*\*(.*?)\*\*/g);
    return standardParts.map((part, index) => {
        if (index % 2 === 1) {
            return <strong key={index}>{part}</strong>;
        }
        return part;
    });
}

function MedicalReportCard({ data }) {
    const severity = data.severity || 'Low';
    const riskScoreStr = data.health_risk_score || '1/10';
    const possibleCondition = data.possible_condition || 'N/A';
    const recommendations = data.recommendations || [];
    const whenToSeeDoctor = data.when_to_see_doctor || [];
    const isEmergency = data.emergency_detected || false;

    // Extract risk numeric score (e.g. 10 from 10/10 or 5 from 5)
    const scoreMatch = riskScoreStr.match(/^(\d+)/);
    const scoreNum = scoreMatch ? parseInt(scoreMatch[1], 10) : 1;

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        
        // Header styling
        doc.setFillColor(3, 169, 244); // light blue background
        doc.rect(0, 0, 210, 40, "F");
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255);
        doc.text("MediMate – Clinical Screening Summary", 20, 26);
        
        // Date
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(230, 245, 255);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 34);
        
        let y = 55;
        
        // Main assessment box
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(0, 102, 153);
        doc.text("PATIENT ASSESSMENT SUMMARY", 20, y);
        y += 8;
        
        // Draw card border
        doc.setDrawColor(220, 220, 220);
        doc.setFillColor(250, 250, 250);
        doc.rect(20, y, 170, 36, "FD");
        
        doc.setFontSize(11);
        doc.setTextColor(50, 50, 50);
        
        doc.setFont("helvetica", "bold");
        doc.text("Possible Cause:", 25, y + 8);
        doc.setFont("helvetica", "normal");
        doc.text(possibleCondition, 60, y + 8);
        
        doc.setFont("helvetica", "bold");
        doc.text("Clinical Severity:", 25, y + 16);
        doc.setFont("helvetica", "normal");
        doc.text(severity === 'High' ? "High Risk (Critical)" : severity === 'Moderate' ? "Moderate (Watchful)" : "Mild", 60, y + 16);
        
        doc.setFont("helvetica", "bold");
        doc.text("Health Risk Score:", 25, y + 24);
        doc.setFont("helvetica", "normal");
        doc.text(`${riskScoreStr} (Calculated triage score)`, 65, y + 24);
        
        if (isEmergency) {
            doc.setFillColor(255, 235, 235);
            doc.setDrawColor(255, 100, 100);
            doc.rect(20, y + 30, 170, 10, "FD");
            doc.setFont("helvetica", "bold");
            doc.setTextColor(180, 0, 0);
            doc.text("⚠️ EMERGENCY ALERT DETECTED - Seek urgent professional care.", 25, y + 36);
            y += 10;
        }
        
        y += 48;
        
        // Care recommendations
        if (recommendations.length > 0) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(13);
            doc.setTextColor(0, 102, 153);
            doc.text("RECOMMENDED GENERAL CARE", 20, y);
            y += 6;
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10.5);
            doc.setTextColor(70, 70, 70);
            
            recommendations.forEach(rec => {
                const lines = doc.splitTextToSize(`• ${rec}`, 165);
                lines.forEach(line => {
                    if (y > 275) { doc.addPage(); y = 25; }
                    doc.text(line, 20, y);
                    y += 5.5;
                });
            });
            y += 6;
        }
        
        // Medical warning triggers
        if (whenToSeeDoctor.length > 0) {
            if (y > 240) { doc.addPage(); y = 25; }
            doc.setFont("helvetica", "bold");
            doc.setFontSize(13);
            doc.setTextColor(180, 0, 0);
            doc.text("WARNING SIGNALS (WHEN TO SEE A PHYSICIAN)", 20, y);
            y += 6;
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10.5);
            doc.setTextColor(70, 70, 70);
            
            whenToSeeDoctor.forEach(item => {
                const lines = doc.splitTextToSize(`• ${item}`, 165);
                lines.forEach(line => {
                    if (y > 275) { doc.addPage(); y = 25; }
                    doc.text(line, 20, y);
                    y += 5.5;
                });
            });
            y += 6;
        }
        
        // Disclaimer block
        y += 8;
        if (y > 250) { doc.addPage(); y = 25; }
        doc.setDrawColor(230, 230, 230);
        doc.line(20, y, 190, y);
        y += 6;
        
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8.5);
        doc.setTextColor(140, 140, 140);
        const disclaimer = doc.splitTextToSize("Disclaimer: MediMate is an AI Healthcare Assistant designed for triage support. It is NOT a substitute for professional clinical diagnosis, advice, or treatment. Always consult with a licensed physician for diagnosis and medical guidance.", 170);
        disclaimer.forEach(line => {
            if (y > 280) { doc.addPage(); y = 25; }
            doc.text(line, 20, y);
            y += 4.5;
        });
        
        doc.save(`MediMate_Clinical_Report_${Date.now()}.pdf`);
    };

    return (
        <div className="medical-report-card">
            <div className="medical-card-header">
                <span className="medical-card-title">🩺 Symptom Analysis Report</span>
                <button className="download-pdf-btn" onClick={handleDownloadPDF} title="Download Medical Report PDF">
                    📥 Save PDF
                </button>
            </div>

            {isEmergency && (
                <div className="emergency-warning-banner">
                    <div className="emergency-icon">⚠️</div>
                    <div className="emergency-content">
                        <div className="emergency-title">Emergency Alert</div>
                        <div className="emergency-subtitle">Seek immediate medical attention.</div>
                    </div>
                </div>
            )}

            <div className="medical-meta-grid">
                <div className="meta-item">
                    <span className="meta-label">Possible Condition</span>
                    <span className="meta-value highlight-condition">{possibleCondition}</span>
                </div>

                <div className="meta-row-split">
                    <div className="meta-item-half">
                        <span className="meta-label">Severity Level</span>
                        <span className={`severity-indicator ${severity.toLowerCase()}`}>
                            {severity === 'High' ? '🔴 High' : severity === 'Moderate' ? '🟡 Moderate' : '🟢 Mild'}
                        </span>
                    </div>

                    <div className="meta-item-half">
                        <span className="meta-label">Health Risk Score</span>
                        <div className="risk-score-container">
                            <div className="risk-bar-bg">
                                <div 
                                    className={`risk-bar-fill risk-level-${scoreNum >= 7 ? 'high' : scoreNum >= 4 ? 'medium' : 'low'}`} 
                                    style={{ width: `${Math.min(scoreNum * 10, 100)}%` }}
                                ></div>
                            </div>
                            <span className="risk-score-value">{riskScoreStr}</span>
                        </div>
                    </div>
                </div>
            </div>

            {recommendations.length > 0 && (
                <div className="report-section">
                    <h5>📋 Care Recommendations</h5>
                    <ul>
                        {recommendations.map((rec, i) => (
                            <li key={i}>{parseBold(rec)}</li>
                        ))}
                    </ul>
                </div>
            )}

            {whenToSeeDoctor.length > 0 && (
                <div className="report-section danger-section">
                    <h5>🚩 When to See a Doctor</h5>
                    <ul>
                        {whenToSeeDoctor.map((item, i) => (
                            <li key={i}>{parseBold(item)}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="medical-disclaimer">
                Disclaimer: I am an AI Healthcare Assistant, not a qualified medical practitioner. This report is for informational purposes only. Always consult a healthcare professional for clinical diagnoses or emergencies.
            </div>
        </div>
    );
}

function MessageBox({ content, bot }) {
    let messageBody;

    if (bot) {
        if (typeof content === 'object' && content !== null) {
            if (content.is_medical === false) {
                messageBody = <p className="non-medical-message">{parseBold(content.message)}</p>;
            } else {
                messageBody = <MedicalReportCard data={content} />;
            }
        } else {
            messageBody = <p>{parseBold(content)}</p>;
        }
    } else {
        messageBody = <p>{parseBold(content)}</p>;
    }

    return (
        <div className={`MessageBoxContainer ${bot ? "bot" : "user"}`}>
            <div className={`ProfileContainer ${bot ? "bot" : "user"}`}>
                <img src={bot ? "/ai_avatar.png" : "/user_avatar.png"} alt={bot ? "Bot Avatar" : "User Avatar"} />
            </div>

            <div className="MessageBodyContainer">
                {messageBody}
            </div>
        </div>
    );
}

export default MessageBox;