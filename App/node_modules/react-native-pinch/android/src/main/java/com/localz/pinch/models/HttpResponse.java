package com.localz.pinch.models;

import org.json.JSONObject;

public class HttpResponse {
    public int statusCode;
    public JSONObject headers;
    public String bodyString;
    public String statusText;

    public HttpResponse() {}

    public HttpResponse(int statusCode, JSONObject headers, String bodyString, String statusText) {
        this.statusCode = statusCode;
        this.headers = headers;
        this.bodyString = bodyString;
        this.statusText = statusText;
    }
}
