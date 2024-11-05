package com.abhij33t.connekt.model;

import com.fasterxml.jackson.databind.JsonNode;

public class ChatMessage {
    private String type;
    private String message;
    private JsonNode data;

    public ChatMessage() {
    }

    private ChatMessage(ChatMessageBuilder builder) {
        this.type = builder.type;
        this.message = builder.message;
        this.data = builder.data;
    }

    public JsonNode getData() {
        return data;
    }

    public String getMessage() {
        return message;
    }

    public String getType() {
        return type;
    }

    public static ChatMessageBuilder builder() {
        return new ChatMessageBuilder();
    }

    public static class ChatMessageBuilder {
        private String type;
        private String message;
        private JsonNode data;

        public ChatMessageBuilder type(String type) {
            this.type = type;
            return this;
        }

        public ChatMessageBuilder data(JsonNode data) {
            this.data = data;
            return this;
        }

        public ChatMessageBuilder message(String message) {
            this.message = message;
            return this;
        }

        public ChatMessage build() {
            return new ChatMessage(this);
        }
    }
}
