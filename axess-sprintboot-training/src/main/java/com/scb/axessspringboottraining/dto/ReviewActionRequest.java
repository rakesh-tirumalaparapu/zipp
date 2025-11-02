package com.scb.axessspringboottraining.dto;

public class ReviewActionRequest {
    private String action; // "APPROVE" or "REJECT"
    private String comment;

    public ReviewActionRequest() {
    }

    public ReviewActionRequest(String action, String comment) {
        this.action = action;
        this.comment = comment;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}

