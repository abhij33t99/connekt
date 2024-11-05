package com.abhij33t.connekt.model;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class ChatMessage {
    private String type;
    private String message;
    private JsonNode data;
}
