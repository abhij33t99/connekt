package com.abhij33t.connekt.handler;

import com.abhij33t.connekt.model.ChatMessage;
import com.abhij33t.connekt.repository.SessionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
public class SocketHandler extends TextWebSocketHandler {

    private static final Logger log = LoggerFactory.getLogger(SocketHandler.class);
    private static final ObjectMapper mapper = new ObjectMapper();

    @Autowired
    private MessageHandler messageHandler;
    @Autowired
    private SessionRepository sessionRepository;

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        String payload = message.getPayload();
        var chatMessage = mapper.readValue(payload, ChatMessage.class);
        switch (chatMessage.getType()) {
            case "get-socket-id" -> messageHandler.sendSocketDetails(session, mapper);
            case "pre-offer" -> messageHandler.handlePreOffer(session, mapper, chatMessage);
            case "pre-offer-answer" -> messageHandler.handlePreOfferAnswer(session, mapper, chatMessage);
            case "webRTC-signaling" -> messageHandler.handleWebRtcSignaling(session, mapper, chatMessage);
            case "hang-up" -> messageHandler.hangUp(session, mapper, chatMessage);
            case "change-stranger-connection-status" ->
                    messageHandler.changeStrangerConnectionStatus(session, chatMessage);
            case "get-stranger-socket-id" -> messageHandler.sendStrangerSocketDetails(session, mapper, chatMessage);
        }
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessionRepository.addSession(session);
        log.info("{} connected", session.getId());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessionRepository.removeSession(session);
        sessionRepository.removeAllowStranger(session);
    }
}
