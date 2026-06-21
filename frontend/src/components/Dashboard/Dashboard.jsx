import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiTrendingUp, FiActivity, FiAlertTriangle, FiUserCheck, FiChevronRight, FiChevronDown, FiTrash2, FiMessageSquare } from "react-icons/fi";
import "./Dashboard.css";

function Dashboard() {
    const [sessions, setSessions] = useState([]);
    const [reports, setReports] = useState([]);
    const [expandedReportId, setExpandedReportId] = useState(null);

    // Load data from localStorage
    useEffect(() => {
        const savedSessions = localStorage.getItem("medimate_sessions");
        if (savedSessions) {
            const parsed = JSON.parse(savedSessions);
            setSessions(parsed);

            // Extract all bot medical report objects across all sessions
            const extractedReports = [];
            parsed.forEach(session => {
                session.messages.forEach(msg => {
                    if (msg.bot && typeof msg.content === 'object' && msg.content !== null && msg.content.is_medical) {
                        extractedReports.push({
                            id: msg.id,
                            sessionId: session.id,
                            sessionTitle: session.title,
                            timestamp: msg.id.split('-')[1] ? parseInt(msg.id.split('-')[1], 10) : Date.now(),
                            ...msg.content
                        });
                    }
                });
            });

            // Sort reports newest first
            extractedReports.sort((a, b) => b.timestamp - a.timestamp);
            setReports(extractedReports);
        }
    }, []);

    // Calculate Analytics Metrics
    const totalLogs = reports.length;
    
    const criticalLogs = reports.filter(r => r.emergency_detected).length;

    const averageRiskScore = reports.length > 0
        ? (reports.reduce((acc, curr) => {
              const scoreMatch = curr.health_risk_score ? curr.health_risk_score.match(/^(\d+)/) : null;
              return acc + (scoreMatch ? parseInt(scoreMatch[1], 10) : 0);
          }, 0) / reports.length).toFixed(1)
        : 0;

    const severityCounts = reports.reduce((acc, curr) => {
        const sev = (curr.severity || 'Mild').toLowerCase();
        acc[sev] = (acc[sev] || 0) + 1;
        return acc;
    }, { mild: 0, moderate: 0, high: 0 });

    const handleToggleExpand = (id) => {
        setExpandedReportId(expandedReportId === id ? null : id);
    };

    const handleDeleteReport = (reportId, sessionId, e) => {
        e.stopPropagation();
        
        // Remove from session
        const updatedSessions = sessions.map(session => {
            if (session.id === sessionId) {
                return {
                    ...session,
                    messages: session.messages.filter(msg => msg.id !== reportId)
                };
            }
            return session;
        });

        localStorage.setItem("medimate_sessions", JSON.stringify(updatedSessions));
        setSessions(updatedSessions);
        setReports(prev => prev.filter(r => r.id !== reportId));
        
        if (expandedReportId === reportId) {
            setExpandedReportId(null);
        }
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>📈 Patient Health Analytics Dashboard</h2>
                <p>Monitor your symptom trends, health risk summaries, and medical consultation advice.</p>
            </div>

            {totalLogs === 0 ? (
                <div className="dashboard-empty-state">
                    <FiActivity className="empty-icon" />
                    <h3>No Health Records Logged Yet</h3>
                    <p>Use our AI Healthcare Assistant chat to analyze symptoms. Your summary reports will automatically populate here.</p>
                    <Link to="/chat" className="empty-cta-btn">Start Symptom Check</Link>
                </div>
            ) : (
                <>
                    {/* Analytics Summary Row */}
                    <div className="analytics-summary-grid">
                        <div className="summary-card shadow-card">
                            <div className="summary-icon-wrapper blue">
                                <FiActivity />
                            </div>
                            <div className="summary-data">
                                <h3>{totalLogs}</h3>
                                <span className="summary-label">Total Logs Analyzed</span>
                            </div>
                        </div>

                        <div className="summary-card shadow-card">
                            <div className="summary-icon-wrapper orange">
                                <FiTrendingUp />
                            </div>
                            <div className="summary-data">
                                <h3>{averageRiskScore}/10</h3>
                                <span className="summary-label">Average Risk Score</span>
                            </div>
                        </div>

                        <div className="summary-card shadow-card">
                            <div className="summary-icon-wrapper red">
                                <FiAlertTriangle />
                            </div>
                            <div className="summary-data">
                                <h3>{criticalLogs}</h3>
                                <span className="summary-label">Emergencies Detected</span>
                            </div>
                        </div>

                        <div className="summary-card shadow-card">
                            <div className="summary-icon-wrapper green">
                                <FiUserCheck />
                            </div>
                            <div className="summary-data">
                                <h3>{reports[0]?.possible_condition || "None"}</h3>
                                <span className="summary-label">Latest Analyzed Condition</span>
                            </div>
                        </div>
                    </div>

                    {/* Severity distribution metrics */}
                    <div className="dashboard-middle-section">
                        <div className="dashboard-card severity-breakdown-card">
                            <h4>Severity Index Breakdown</h4>
                            <div className="severity-bar-chart">
                                <div className="bar-item">
                                    <span className="bar-label">High Severity</span>
                                    <div className="bar-track">
                                        <div 
                                            className="bar-fill high" 
                                            style={{ width: `${(severityCounts.high / totalLogs) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="bar-value">{severityCounts.high} logs</span>
                                </div>

                                <div className="bar-item">
                                    <span className="bar-label">Moderate Severity</span>
                                    <div className="bar-track">
                                        <div 
                                            className="bar-fill moderate" 
                                            style={{ width: `${(severityCounts.moderate / totalLogs) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="bar-value">{severityCounts.moderate} logs</span>
                                </div>

                                <div className="bar-item">
                                    <span className="bar-label">Mild Severity</span>
                                    <div className="bar-track">
                                        <div 
                                            className="bar-fill mild" 
                                            style={{ width: `${(severityCounts.mild / totalLogs) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="bar-value">{severityCounts.mild} logs</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Medical Records Table */}
                    <div className="dashboard-card records-card">
                        <h4>Recent Symptom Analysis History</h4>
                        <div className="records-list">
                            {reports.map((report) => {
                                const isExpanded = expandedReportId === report.id;
                                const scoreMatch = report.health_risk_score ? report.health_risk_score.match(/^(\d+)/) : null;
                                const scoreNum = scoreMatch ? parseInt(scoreMatch[1], 10) : 1;

                                return (
                                    <div key={report.id} className={`record-item ${report.emergency_detected ? 'emergency-bg' : ''}`}>
                                        <div className="record-header" onClick={() => handleToggleExpand(report.id)}>
                                            <div className="record-meta">
                                                <span className="record-date">{formatDate(report.timestamp)}</span>
                                                <span className="record-conversation-link">
                                                    <FiMessageSquare /> {report.sessionTitle}
                                                </span>
                                            </div>
                                            
                                            <div className="record-main-info">
                                                <span className="record-condition">{report.possible_condition}</span>
                                                <div className="record-indicators">
                                                    <span className={`severity-indicator ${report.severity.toLowerCase()}`}>
                                                        {report.severity}
                                                    </span>
                                                    <span className="record-risk-score">Risk: {report.health_risk_score}</span>
                                                </div>
                                            </div>

                                            <div className="record-actions">
                                                <button 
                                                    className="delete-report-btn" 
                                                    onClick={(e) => handleDeleteReport(report.id, report.sessionId, e)}
                                                    aria-label="Delete report entry"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                                <span className="expand-chevron">
                                                    {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
                                                </span>
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="record-details-pane">
                                                {report.emergency_detected && (
                                                    <div className="emergency-warning-banner" style={{ margin: "0 0 1rem 0" }}>
                                                        <div className="emergency-icon">⚠️</div>
                                                        <div className="emergency-content">
                                                            <div className="emergency-title">Critical Safety Triggered</div>
                                                            <div className="emergency-subtitle">Chest pain or severe respiration issues detected. Immediate consult advised.</div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="details-grid">
                                                    {report.recommendations?.length > 0 && (
                                                        <div className="details-section">
                                                            <h5>📋 Core Recommendations</h5>
                                                            <ul>
                                                                {report.recommendations.map((rec, index) => (
                                                                    <li key={index}>{rec}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {report.when_to_see_doctor?.length > 0 && (
                                                        <div className="details-section danger-style">
                                                            <h5>🚩 Emergency Consult Guidelines</h5>
                                                            <ul>
                                                                {report.when_to_see_doctor.map((doctorRule, index) => (
                                                                    <li key={index}>{doctorRule}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Dashboard;
