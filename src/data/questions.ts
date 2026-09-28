import { QuestionsCatalog } from '../types/question';

export const questionsData: QuestionsCatalog = {
  coding: [
    {
      id: 1,
      title: 'Two Sum',
      difficulty: 'Easy',
      description:
        'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order (as a JSON array of two indices).',
      starterCode: `function twoSum(nums, target) {
  // Write your solution here
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      testCases: [
        {
          input: [[2, 7, 11, 15], 9],
          expected: [0, 1],
          description: 'Standard case: nums = [2, 7, 11, 15], target = 9'
        },
        {
          input: [[3, 2, 4], 6],
          expected: [1, 2],
          description: 'Unordered elements: nums = [3, 2, 4], target = 6'
        },
        {
          input: [[3, 3], 6],
          expected: [0, 1],
          description: 'Duplicate values: nums = [3, 3], target = 6'
        }
      ],
      examples: [
        {
          input: 'nums = [2,7,11,15], target = 9',
          output: '[0, 1]',
          explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
        },
        {
          input: 'nums = [3,2,4], target = 6',
          output: '[1, 2]',
          explanation: 'nums[1] + nums[2] == 6, we return [1, 2].'
        }
      ],
      constraints: [
        '2 <= nums.length <= 10^4',
        '-10^9 <= nums[i] <= 10^9',
        '-10^9 <= target <= 10^9',
        'Only one valid answer exists.'
      ]
    },
    {
      id: 2,
      title: 'LRU Cache Design',
      difficulty: 'Medium',
      description:
        'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the `LRUCache` class with `get(key)` and `put(key, value)` both running in O(1) average time complexity.',
      starterCode: `class LRUCache {
  /**
   * @param {number} capacity
   */
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  /**
   * @param {number} key
   * @return {number}
   */
  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  /**
   * @param {number} key
   * @param {number} value
   * @return {void}
   */
  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }
}`,
      testCases: [
        {
          input: [
            ['LRUCache', 'put', 'put', 'get', 'put', 'get', 'put', 'get', 'get', 'get'],
            [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
          ],
          expected: [null, null, null, 1, null, -1, null, -1, 3, 4],
          description: 'LRU Cache eviction sequence with capacity 2'
        }
      ],
      constraints: [
        '1 <= capacity <= 3000',
        '0 <= key <= 10^4',
        '0 <= value <= 10^5',
        'At most 2 * 10^5 calls will be made to get and put'
      ]
    }
  ],

  architecture: [
    {
      id: 1,
      title: 'Design a URL Shortener',
      difficulty: 'Medium',
      description:
        'Design a scalable URL shortening service like TinyURL or Bitly. The service should generate short aliases for long URLs, redirect clients with low latency (HTTP 301/302), handle custom aliases, and handle high read-to-write ratios (100:1) with high availability.',
      patterns: [
        'Microservices Architecture',
        'Serverless / Edge Functions',
        'Monolithic with Read Replicas',
        'Event-Driven Architecture'
      ],
      requirements: [
        'Generate short 7-character Base62 hash for long URLs',
        'Handle 100M new URLs/month and 10B redirects/month',
        'Low redirection latency (< 20ms)',
        'Resilience against single points of failure (multi-region, caching)',
        'Analytics tracking for click counts without degrading redirect performance'
      ],
      starterDiagram: `[Client Browser]
       │ (HTTP GET /abc1234)
       ▼
[Edge CDN / Cloudflare] ──(Cache Hit 301)──> [Client]
       │ (Cache Miss)
       ▼
[API Gateway / Load Balancer]
       │
       ▼
[URL Redirect Service (Stateless Pods)]
       │
       ├───> [Redis Cluster (LRU Cache)]
       │
       └───> [PostgreSQL / CockroachDB Sharded]
              - id (BIGINT PK)
              - short_code (VARCHAR UNIQUE)
              - original_url (TEXT)
              - created_at (TIMESTAMP)
       │
[Async Click Event Kafka Topic] ──> [Analytics Consumer] ──> [ClickHouse]`
    },
    {
      id: 2,
      title: 'Design a Chat Application',
      difficulty: 'Hard',
      description:
        'Design a real-time messaging application like Slack or WhatsApp supporting 1-on-1 direct messaging, group channels with up to 10,000 members, read receipts, offline message delivery, and search across past conversations.',
      patterns: [
        'WebSocket Gateway + Pub/Sub',
        'Event-Driven Microservices',
        'CQRS & Event Sourcing',
        'Peer-to-Peer with WebRTC'
      ],
      requirements: [
        'Sub-100ms message delivery between online users',
        'Preserve message order per conversation channel',
        'Support push notifications for offline users',
        'Horizontal scalability for 50M concurrent WebSocket connections',
        'End-to-end encryption or secure storage at rest'
      ],
      starterDiagram: `[Mobile / Web Client]
       │ WebSocket (WSS)
       ▼
[WebSocket Gateway Layer (Envoy / API Gateway)]
       │
  ┌────┴──────────────────────────┐
  ▼                               ▼
[Session Manager (Redis)]    [Chat Service Cluster]
                                  │
      ┌───────────────────────────┼──────────────────────────┐
      ▼                           ▼                          ▼
[Kafka Message Bus]     [Cassandra / ScyllaDB]      [Push Notification Worker]
 (Fanout to channels)    (Message History Partitioned        (FCM / APNs)
                          by channel_id + timestamp)`
    }
  ],

  system: [
    {
      id: 1,
      title: 'Design Netflix Video Streaming',
      difficulty: 'Hard',
      description:
        'Design a planetary-scale video on demand (VOD) streaming infrastructure capable of streaming high-definition video to 250M+ global subscribers concurrently with adaptive bitrate streaming (HLS/DASH), minimum buffering, and CDN edge optimization.',
      requirements: [
        'Support adaptive bitrate encoding (240p to 4K Dolby Vision)',
        'Global Content Delivery Network (Open Connect / CDN) edge caching',
        'Playback state synchronization across multi-device user accounts',
        'Zero-downtime microservice architecture for catalog & authentication',
        'Recommendation and personalized search integration'
      ],
      availableComponents: [
        'API Gateway & Load Balancer',
        'Content Delivery Network (CDN Edge)',
        'Video Transcoding Pipeline (FFmpeg / AWS MediaConvert)',
        'Object Storage (AWS S3 / Blob Storage)',
        'Metadata Store (Cassandra / DynamoDB)',
        'User Session & Watch History Cache (Redis)',
        'Message Broker (Apache Kafka)',
        'Search & Recommendation Engine (Elasticsearch / ML Service)',
        'DRM / License Key Server (Widevine / FairPlay)'
      ]
    }
  ],

  debugging: [
    {
      id: 1,
      title: 'Fix the Memory Leak',
      difficulty: 'Medium',
      description:
        'A production dashboard widget renders an active live ticker displaying real-time metrics. Users report that after keeping the dashboard open for a few hours, the browser tab consumes over 2GB of RAM and stutters severely until crashing. Investigate the component code, locate the dangling interval and event listener references, and provide the clean solution.',
      buggyCode: `import React, { useState, useEffect } from 'react';

export function LiveMetricsTracker({ deviceId }) {
  const [metric, setMetric] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // ⚠️ BUG: setInterval is started on every render or when deviceId changes,
    // but the cleanup function is missing!
    // The interval closure holds onto previous state and keeps scheduling updates.
    const timer = setInterval(() => {
      const nextVal = Math.floor(Math.random() * 100);
      setMetric(nextVal);
      // BUG: Accumulates unbounded historical items in memory indefinitely
      setHistory(prev => [...prev, { time: Date.now(), val: nextVal }]);
    }, 1000);

    // Event listener attached without cleanup
    window.addEventListener('resize', () => {
      console.log('Window resized for device', deviceId);
    });

    // MISSING: return () => { clearInterval(timer); window.removeEventListener(...); }
  }, [deviceId]);

  return (
    <div className="metrics-card">
      <h3>Device {deviceId}</h3>
      <p>Current Metric: {metric}</p>
      <p>History Count: {history.length}</p>
    </div>
  );
}`,
      starterCode: `import React, { useState, useEffect } from 'react';

export function LiveMetricsTracker({ deviceId }) {
  const [metric, setMetric] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Fix the memory leak here by ensuring timers and event listeners are properly disposed
    const handleResize = () => {
      // Handle resize safely
    };

    window.addEventListener('resize', handleResize);

    const timer = setInterval(() => {
      const nextVal = Math.floor(Math.random() * 100);
      setMetric(nextVal);
      // Cap history to prevent unbounded array growth in memory
      setHistory(prev => [...prev.slice(-49), { time: Date.now(), val: nextVal }]);
    }, 1000);

    return () => {
      // Add required cleanup
      clearInterval(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [deviceId]);

  return (
    <div className="metrics-card">
      <h3>Device {deviceId}</h3>
      <p>Current Metric: {metric}</p>
      <p>History Count: {history.length}</p>
    </div>
  );
}`,
      expectedBehavior:
        'When the component unmounts or deviceId changes, any active intervals must be cancelled with clearInterval() and window resize event handlers removed with removeEventListener(). History buffer should be bounded.',
      hints: [
        'Inspect the return value of useEffect. Does it return a teardown function?',
        'Notice what happens to setInterval when deviceId changes: a new interval starts without clearing the old one.',
        'Consider capping the maximum items in the history array to prevent memory bloat.'
      ],
      knownBugDescription:
        'Missing useEffect cleanup function failing to call clearInterval(timer) and removeEventListener, leading to orphaned intervals running indefinitely and unbounded array allocations.'
    }
  ],

  database: [
    {
      id: 1,
      title: 'Design an E-commerce Schema',
      difficulty: 'Medium',
      description:
        'Design a normalized relational database schema (SQL) and companion RESTful/GraphQL API endpoints for a modern multi-vendor e-commerce platform. Your design must handle users, products with variant options (size, color, SKU), inventory stock control with atomic reservations, shopping carts, orders, and payment transactions.',
      requirements: [
        'Normalized schema with proper Primary Keys (UUID / BIGSERIAL) and Foreign Keys',
        'Concurrency-safe inventory reservation to avoid overselling flash-sale items',
        'Order and OrderItem snapshotting (product price at moment of purchase)',
        'Idempotent payment transaction tracking with status states (pending, succeeded, failed, refunded)',
        'Key indexing strategy for high-performance category and search filtering'
      ],
      starterSchema: `-- E-Commerce Relational Schema
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(120),
    role VARCHAR(20) DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    parent_id INT REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(280) UNIQUE NOT NULL,
    category_id INT REFERENCES categories(id),
    base_price NUMERIC(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(64) UNIQUE NOT NULL,
    attributes JSONB NOT NULL DEFAULT '{}', -- e.g. {"color": "navy", "size": "XL"}
    price_override NUMERIC(10, 2),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0)
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    status VARCHAR(32) NOT NULL DEFAULT 'pending', -- pending, paid, shipped, cancelled
    total_amount NUMERIC(10, 2) NOT NULL,
    shipping_address JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id),
    unit_price NUMERIC(10, 2) NOT NULL, -- price snapshot
    quantity INT NOT NULL CHECK (quantity > 0)
);`,
      sampleQueriesPrompt:
        'Write SQL queries for:\n1. Finding low-stock variants with active products\n2. Safely decrementing stock during checkout with atomic lock\n3. Calculating monthly sales revenue by category'
    }
  ],

  security: [
    {
      id: 1,
      title: 'Identify Vulnerabilities',
      difficulty: 'Medium',
      description:
        'Review the backend authentication & profile lookup endpoint below. Identify the primary critical security vulnerabilities present in the code, fix the code to follow defense-in-depth best practices, and provide an explanation of how an attacker could exploit the flaws.',
      vulnerableSnippet: `// Express.js Route Handler
const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/api/user/login', async (req, res) => {
  const { username, password } = req.body;

  // ⚠️ CRITICAL VULNERABILITY: Raw string concatenation in SQL query
  const query = "SELECT id, username, role, password_hash FROM users WHERE username = '" 
    + username + "' AND password_hash = '" + password + "'";

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message }); // ⚠️ Info leak: raw DB error returned
    }
    if (results.length > 0) {
      const user = results[0];
      // ⚠️ Insecure: Plain string password comparison without bcrypt/argon2 hashing
      return res.json({ success: true, user: { id: user.id, role: user.role } });
    }
    return res.status(401).json({ error: 'Invalid credentials' });
  });
});

module.exports = router;`,
      vulnerabilityOptions: [
        'SQL Injection (CWE-89)',
        'Broken Authentication / Plaintext Password Handling (CWE-256)',
        'Verbose Information Disclosure / Error Leaking (CWE-209)',
        'Cross-Site Scripting (XSS) (CWE-79)',
        'Server-Side Request Forgery (SSRF) (CWE-918)',
        'Insecure Direct Object Reference (IDOR) (CWE-639)'
      ],
      primaryVulnerability: 'SQL Injection (CWE-89)',
      hints: [
        'Look at how the SQL query string is constructed with user-supplied input parameters.',
        'An input of \' OR 1=1 -- for username allows authentication bypass.',
        'Check whether parameterized queries or prepared statements are being used.'
      ]
    }
  ]
};
