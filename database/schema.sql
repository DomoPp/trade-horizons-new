CREATE TABLE regions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE goods (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  base_price DECIMAL(10,2) NOT NULL
);

CREATE TABLE event_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

CREATE TABLE game_saves (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  current_turn INT NOT NULL DEFAULT 1,
  region_id INT NOT NULL,
  money DECIMAL(12,2) NOT NULL DEFAULT 1000.00,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (region_id) REFERENCES regions(id)
);

CREATE INDEX idx_game_saves_created_at ON game_saves (created_at);

CREATE TABLE player_inventory (
  id INT PRIMARY KEY AUTO_INCREMENT,
  save_id INT NOT NULL,
  good_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  FOREIGN KEY (save_id) REFERENCES game_saves(id),
  FOREIGN KEY (good_id) REFERENCES goods(id),
  UNIQUE KEY uniq_inventory_save_good (save_id, good_id)
);

CREATE TABLE trade_plans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  save_id INT NOT NULL,
  turn INT NOT NULL,
  region_id INT NOT NULL,
  good_id INT NOT NULL,
  quantity INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (save_id) REFERENCES game_saves(id),
  FOREIGN KEY (region_id) REFERENCES regions(id),
  FOREIGN KEY (good_id) REFERENCES goods(id)
);

CREATE INDEX idx_trade_plans_save_turn ON trade_plans (save_id, turn);

CREATE TABLE transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  save_id INT NOT NULL,
  turn INT NOT NULL,
  good_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (save_id) REFERENCES game_saves(id),
  FOREIGN KEY (good_id) REFERENCES goods(id)
);

CREATE INDEX idx_transactions_save_turn ON transactions (save_id, turn);

CREATE TABLE market_prices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  turn INT NOT NULL,
  region_id INT NOT NULL,
  good_id INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (region_id) REFERENCES regions(id),
  FOREIGN KEY (good_id) REFERENCES goods(id)
);

CREATE INDEX idx_market_prices_turn_region ON market_prices (turn, region_id);
CREATE INDEX idx_market_prices_turn_good ON market_prices (turn, good_id);

CREATE TABLE active_events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  save_id INT NOT NULL,
  turn INT NOT NULL,
  event_type_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (save_id) REFERENCES game_saves(id),
  FOREIGN KEY (event_type_id) REFERENCES event_types(id)
);

CREATE TABLE incidents (
  id INT PRIMARY KEY AUTO_INCREMENT,
  save_id INT NOT NULL,
  turn INT NOT NULL,
  description TEXT NOT NULL,
  state VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (save_id) REFERENCES game_saves(id)
);

CREATE INDEX idx_incidents_state ON incidents (state);

CREATE TABLE turn_results (
  id INT PRIMARY KEY AUTO_INCREMENT,
  save_id INT NOT NULL,
  turn INT NOT NULL,
  summary JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (save_id) REFERENCES game_saves(id)
);

CREATE INDEX idx_turn_results_save_turn ON turn_results (save_id, turn);
