// ConnectionStatus.test.tsx
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ConnectionStatus } from './ConnectionStatus';
import { ServerMessageAction } from '../types/ServerMessages';

import { useSharedWebSocket } from '../providers/WebSocketProvider';

// Mock the websocket hook
vi.mock('../providers/WebSocketProvider', () => ({
  useSharedWebSocket: vi.fn(),
}));

describe('ConnectionStatus', () => {
  const mockSubscribe = vi.fn();
  let messageHandler: any;

  beforeEach(() => {
    vi.useFakeTimers();

    mockSubscribe.mockImplementation((cb) => {
      messageHandler = cb;
      return vi.fn(); // unsubscribe
    });

    (useSharedWebSocket as any).mockReturnValue({
      connected: true,
      subscribe: mockSubscribe,
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.resetAllMocks();
  });

  it('renders connected status', () => {
    render(<ConnectionStatus />);
    expect(screen.getByText('Connected')).toBeInTheDocument();
  });

  it('renders disconnected status', () => {
    (useSharedWebSocket as any).mockReturnValue({
      connected: false,
      subscribe: mockSubscribe,
    });

    render(<ConnectionStatus />);
    expect(screen.getByText('Disconnected')).toBeInTheDocument();
  });

  it('shows heartbeat when HEARTBEAT message is received', () => {
    render(<ConnectionStatus />);

    act(() => {
      messageHandler({ type: ServerMessageAction.HEARTBEAT });
    });

    const heart = screen.getByText('❤️');
    expect(heart).toHaveStyle({ opacity: '1' });
  });

  it('hides heartbeat after 5 seconds', () => {
    render(<ConnectionStatus />);

    act(() => {
      messageHandler({ type: ServerMessageAction.HEARTBEAT });
    });

    const heart = screen.getByText('❤️');
    expect(heart).toHaveStyle({ opacity: '1' });

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(heart).toHaveStyle({ opacity: '0.1' });
  });

  it('clears previous timer when receiving multiple heartbeats', () => {
    const clearSpy = vi.spyOn(global, 'clearTimeout');

    render(<ConnectionStatus />);

    act(() => {
      messageHandler({ type: ServerMessageAction.HEARTBEAT });
    });

    act(() => {
      messageHandler({ type: ServerMessageAction.HEARTBEAT });
    });

    expect(clearSpy).toHaveBeenCalled();
  });
});
