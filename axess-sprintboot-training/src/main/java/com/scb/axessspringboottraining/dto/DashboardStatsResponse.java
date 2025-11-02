package com.scb.axessspringboottraining.dto;

public class DashboardStatsResponse {
    private Integer totalApplications;
    private Integer pendingApplications;
    private Integer withCheckerApplications;
    private Integer approvedApplications;
    private Integer rejectedApplications;

    public DashboardStatsResponse() {
    }

    public Integer getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(Integer totalApplications) {
        this.totalApplications = totalApplications;
    }

    public Integer getPendingApplications() {
        return pendingApplications;
    }

    public void setPendingApplications(Integer pendingApplications) {
        this.pendingApplications = pendingApplications;
    }

    public Integer getWithCheckerApplications() {
        return withCheckerApplications;
    }

    public void setWithCheckerApplications(Integer withCheckerApplications) {
        this.withCheckerApplications = withCheckerApplications;
    }

    public Integer getApprovedApplications() {
        return approvedApplications;
    }

    public void setApprovedApplications(Integer approvedApplications) {
        this.approvedApplications = approvedApplications;
    }

    public Integer getRejectedApplications() {
        return rejectedApplications;
    }

    public void setRejectedApplications(Integer rejectedApplications) {
        this.rejectedApplications = rejectedApplications;
    }
}

