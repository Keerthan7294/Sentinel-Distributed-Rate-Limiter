import { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './index.css';

function App() {
  const [logs, setLogs] = useState([]);
  const [connected, setConnected] = useState(false);
  const logsEndRef = useRef(null);

  const stats = {
    total: logs.length,
    allowed: logs.filter(l => l.allowed).length,
    rejected: logs.filter(l => !l.allowed).length
  };

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws/logs');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        // console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = (frame) => {
      setConnected(true);
      stompClient.subscribe('/topic/traffic', (message) => {
        const log = JSON.parse(message.body);
        setLogs((prev) => [...prev, log].slice(-100)); // keep last 100
      });
    };

    stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    stompClient.onDisconnect = () => {
      setConnected(false);
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Sentinel Dashboard</h1>
        <p>Real-time distributed rate-limiting traffic visualization</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">Total Requests</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Allowed</div>
          <div className="stat-value success">{stats.allowed}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Rate Limited</div>
          <div className="stat-value danger">{stats.rejected}</div>
        </div>
      </div>

      <div className="logs-container">
        <div className="logs-header">
          <h2>Traffic Logs</h2>
          <div className="connection-status">
            <span className={`status-indicator ${connected ? 'connected' : 'disconnected'}`}></span>
            {connected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
        <ul className="logs-list">
          {logs.map((log, index) => (
            <li key={index} className="log-item">
              <span className={`log-status ${log.allowed ? 'allowed' : 'rejected'}`}>
                {log.allowed ? '200 OK' : '429 Too Many'}
              </span>
              <div className="log-details">
                <span className="log-client">{log.clientId}</span>
                <span className="log-path">{log.path}</span>
              </div>
              <span className="log-time">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </li>
          ))}
          <div ref={logsEndRef} />
        </ul>
      </div>
    </div>
  );
}

export default App;
