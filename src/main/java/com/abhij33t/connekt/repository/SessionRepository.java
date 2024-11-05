package com.abhij33t.connekt.repository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import org.springframework.web.socket.WebSocketSession;

import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

@Repository
public class SessionRepository {

    private final Set<WebSocketSession> sessions;
    private final Set<WebSocketSession> allowStrangersSet;
    private static final Logger log = LoggerFactory.getLogger(SessionRepository.class);

    public SessionRepository() {
        sessions = new CopyOnWriteArraySet<>();
        allowStrangersSet = new CopyOnWriteArraySet<>();
    }

    public Set<WebSocketSession> getSessions() {
        return sessions;
    }

    public boolean doesExist(WebSocketSession session) {
        return sessions.contains(session);
    }

    public void addSession(WebSocketSession session) {
        sessions.add(session);
    }

    public void removeSession(WebSocketSession session) {
        sessions.remove(session);
    }

    public void addAllowStranger(WebSocketSession session) {
        allowStrangersSet.add(session);
    }

    public void removeAllowStranger(WebSocketSession session) {
        allowStrangersSet.remove(session);
    }

    public Set<WebSocketSession> getAllowStrangerSet() {
        return allowStrangersSet;
    }

}
