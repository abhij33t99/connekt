package com.abhij33t.connekt.handler;

import com.abhij33t.connekt.model.ChatMessage;
import com.abhij33t.connekt.repository.SessionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class MessageHandler {

    private static final Logger log = LoggerFactory.getLogger(MessageHandler.class);

    @Autowired
    private SessionRepository sessionRepository;

    public void sendSocketDetails(WebSocketSession session, ObjectMapper mapper) throws IOException {
        var reply = ChatMessage.builder().type("socket-id").message(session.getId()).build();
        session.sendMessage(new TextMessage(mapper.writeValueAsString(reply)));
        log.info("sent {}", reply);
    }

    public void handlePreOffer(WebSocketSession session, ObjectMapper mapper, ChatMessage message) throws IOException {
        var callerId = message.getData().get("callerId").asText();
        var callType = message.getData().get("callType").asText();
        var webSocketSession = sessionRepository.getSessions().stream()
                .filter(s -> s.getId().equals(callerId))
                .findFirst()
                .orElse(null);
        var data = JsonNodeFactory.instance.objectNode();
        if (webSocketSession == null || webSocketSession.getId().equals(session.getId())) {
            data.put("preOfferAnswer", "CALLEE_NOT_FOUND");
            var ansMessage = ChatMessage.builder().type("pre-offer-answer").data(data).build();
            session.sendMessage(new TextMessage(mapper.writeValueAsString(ansMessage)));
        } else {
            data.put("callerId", session.getId());
            data.put("callType", callType);
            var preMessage = ChatMessage.builder().type("pre-offer").data(data).build();
            webSocketSession.sendMessage(new TextMessage(mapper.writeValueAsString(preMessage)));
            log.info("sent pre offer to {}", callerId);
        }
    }

    public void handlePreOfferAnswer(WebSocketSession session, ObjectMapper mapper, ChatMessage message) throws IOException {
        var callerId = message.getData().get("callerId").asText();
        var webSocketSession = sessionRepository.getSessions().stream()
                .filter(s -> s.getId().equals(callerId))
                .findFirst()
                .orElse(null);
        var data = JsonNodeFactory.instance.objectNode();
        data.put("callerId", session.getId());
        data.put("preOfferAnswer", message.getData().get("preOfferAnswer").asText());
        var ansMessage = ChatMessage.builder().type("pre-offer-answer").data(data).build();
        webSocketSession.sendMessage(new TextMessage(mapper.writeValueAsString(ansMessage)));
    }

    public void handleWebRtcSignaling(WebSocketSession session, ObjectMapper mapper, ChatMessage message) throws IOException {
        var callerId = message.getData().get("callerId").asText();
        var webSocketSession = sessionRepository.getSessions().stream()
                .filter(s -> s.getId().equals(callerId))
                .findFirst()
                .orElse(null);
        if (webSocketSession != null) {
            var data = JsonNodeFactory.instance.objectNode();
            data.put("callerId", session.getId());
            data.put("type", message.getData().get("type").asText());
            data.put("offer", message.getData().get("offer"));
            var ansMessage = ChatMessage.builder().type("webRTC-signaling").data(data).build();
            webSocketSession.sendMessage(new TextMessage(mapper.writeValueAsString(ansMessage)));
        }
    }

    public void hangUp(WebSocketSession session, ObjectMapper mapper, ChatMessage message) throws IOException {
        var callerId = message.getData().get("callerId").asText();
        var webSocketSession = sessionRepository.getSessions().stream()
                .filter(s -> s.getId().equals(callerId))
                .findFirst()
                .orElse(null);
        if (webSocketSession != null) {
            var ansMessage = ChatMessage.builder().type("hang-up").build();
            webSocketSession.sendMessage(new TextMessage(mapper.writeValueAsString(ansMessage)));
        }
    }

    public void changeStrangerConnectionStatus(WebSocketSession session, ChatMessage message) throws IOException {
        var status = message.getData().get("status").asBoolean();
        if (status) {
            sessionRepository.addAllowStranger(session);
        } else {
            sessionRepository.removeAllowStranger(session);
        }
    }

    public void sendStrangerSocketDetails(WebSocketSession session, ObjectMapper mapper, ChatMessage message) throws IOException {
        String socketId = session.getId();
        String randomSocketId = null;
        var size = sessionRepository.getAllowStrangerSet().size();
        var data = JsonNodeFactory.instance.objectNode();
        if (size > 1) {
            var strangerSession = sessionRepository.getAllowStrangerSet().stream()
                    .filter(s -> !s.getId().equals(socketId))
                    .skip(ThreadLocalRandom.current().nextInt(sessionRepository.getAllowStrangerSet().size() - 1))
                    .findFirst();
            if (strangerSession.isPresent()) {
                randomSocketId = strangerSession.get().getId();
                data.put("callerId", randomSocketId);
            }
        }
        var ansMessage = ChatMessage.builder().type("get-stranger-socket-id").data(data).build();
        session.sendMessage(new TextMessage(mapper.writeValueAsString(ansMessage)));
    }
}
