# MaengMe n8n Agent Orchestration Architecture

## Overview

n8n serves as the central nervous system for the MaengMe Support Staff (MSS), providing:
- Agent orchestration and routing
- Persistent memory management
- Context sharing between agents
- Workflow automation
- External tool integration
- Real-time monitoring and logging

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                    MaengMe PWA                       │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐   │
│  │  Home  │  │Session │  │Analytics│  │Profile │   │
│  └────────┘  └────────┘  └────────┘  └────────┘   │
└─────────────┬────────────────────────────┬──────────┘
              │                            │
              ▼                            ▼
     ┌────────────────┐           ┌──────────────┐
     │   Supabase     │           │  n8n Server  │
     │   Database     │◄──────────┤  (Workflows) │
     └────────────────┘           └──────┬───────┘
                                          │
                    ┌─────────────────────┼──────────────────────┐
                    │                     │                      │
             ┌──────▼──────┐      ┌──────▼──────┐      ┌────────▼────────┐
             │    Aria     │      │   Dr. Sage  │      │      Luna       │
             │  Workflow   │      │  Workflow   │      │    Workflow     │
             └──────┬──────┘      └──────┬──────┘      └────────┬────────┘
                    │                     │                      │
                    └─────────────────────┼──────────────────────┘
                                          │
                              ┌───────────▼────────────┐
                              │   Shared Memory Store  │
                              │  (Context & History)   │
                              └────────────────────────┘
```

## n8n Workflows

### 1. Master Orchestrator Workflow

**Trigger**: Webhook from MaengMe app
**Purpose**: Route requests to appropriate agent workflow

```json
{
  "id": "master-orchestrator",
  "nodes": [
    {
      "type": "webhook",
      "name": "Incoming Request",
      "path": "/maengme/agent"
    },
    {
      "type": "switch",
      "name": "Route to Agent",
      "rules": [
        {"field": "agentId", "value": "aria", "output": "Aria Workflow"},
        {"field": "agentId", "value": "sage", "output": "Sage Workflow"},
        {"field": "agentId", "value": "luna", "output": "Luna Workflow"}
      ]
    },
    {
      "type": "supabase",
      "name": "Load User Context",
      "operation": "select",
      "table": "user_profiles"
    },
    {
      "type": "supabase",
      "name": "Load Agent Memory",
      "operation": "select",
      "table": "agent_memory",
      "filters": ["user_id", "last_24_hours"]
    }
  ]
}
```

### 2. Aria Workflow (Onboarding & Navigation)

**Purpose**: Handle conversational onboarding and profile building

```json
{
  "id": "aria-workflow",
  "nodes": [
    {
      "type": "function",
      "name": "Prepare Context",
      "code": "// Combine user profile + recent memory"
    },
    {
      "type": "http",
      "name": "Claude API - Aria Persona",
      "url": "https://api.anthropic.com/v1/messages",
      "body": {
        "system": "You are Aria, a warm wellness navigator...",
        "messages": "{{conversation}}",
        "context": "{{userContext}}"
      }
    },
    {
      "type": "function",
      "name": "Extract Entities",
      "code": "// Parse response for profile data"
    },
    {
      "type": "split",
      "name": "Process Updates",
      "outputs": [
        "Update Profile",
        "Store Memory",
        "Generate Voice"
      ]
    },
    {
      "type": "supabase",
      "name": "Update Profile",
      "operation": "upsert",
      "table": "user_profiles"
    },
    {
      "type": "supabase",
      "name": "Store Memory",
      "operation": "insert",
      "table": "agent_memory",
      "data": {
        "memory_type": "{{extractedType}}",
        "memory_key": "{{extractedKey}}",
        "memory_value": "{{extractedValue}}"
      }
    },
    {
      "type": "http",
      "name": "ElevenLabs TTS",
      "url": "https://api.elevenlabs.io/v1/text-to-speech",
      "body": {
        "text": "{{response}}",
        "voice_id": "aria_warm_female"
      }
    }
  ]
}
```

### 3. Dr. Sage Workflow (Analytics & Insights)

**Purpose**: Provide data-driven insights and tapering strategies

```json
{
  "id": "sage-workflow",
  "nodes": [
    {
      "type": "supabase",
      "name": "Load Session History",
      "operation": "select",
      "table": "sessions",
      "limit": 50
    },
    {
      "type": "function",
      "name": "Calculate Analytics",
      "code": `
        // Pattern detection
        const patterns = analyzeSessionPatterns(sessions);
        const trends = calculateTrends(sessions);
        const risks = identifyRiskFactors(sessions);
        return { patterns, trends, risks };
      `
    },
    {
      "type": "http",
      "name": "Claude API - Sage Analysis",
      "body": {
        "system": "You are Dr. Sage, an analytical expert...",
        "context": {
          "patterns": "{{patterns}}",
          "userQuestion": "{{question}}"
        }
      }
    },
    {
      "type": "conditional",
      "name": "Check for Tapering Request",
      "condition": "{{message.includes('taper')}}",
      "true": "Generate Tapering Plan"
    },
    {
      "type": "function",
      "name": "Generate Tapering Plan",
      "code": "// Create personalized reduction schedule"
    }
  ]
}
```

### 4. Luna Workflow (Session Support)

**Purpose**: Capture post-peak experiences

```json
{
  "id": "luna-workflow",
  "nodes": [
    {
      "type": "webhook",
      "name": "Post-Peak Trigger",
      "path": "/maengme/luna/capture"
    },
    {
      "type": "wait",
      "name": "Delay 3 Minutes",
      "value": 180,
      "unit": "seconds"
    },
    {
      "type": "http",
      "name": "Send Gentle Prompt",
      "method": "POST",
      "url": "{{app_webhook}}",
      "body": {
        "type": "prompt",
        "message": "How was your experience?",
        "options": ["Dictate", "Type", "Later"]
      }
    },
    {
      "type": "switch",
      "name": "Handle Response",
      "rules": [
        {"value": "dictate", "output": "Voice Capture"},
        {"value": "type", "output": "Text Capture"},
        {"value": "later", "output": "Schedule Reminder"}
      ]
    },
    {
      "type": "http",
      "name": "Whisper Transcription",
      "url": "https://api.openai.com/v1/audio/transcriptions"
    },
    {
      "type": "supabase",
      "name": "Store Experience",
      "operation": "update",
      "table": "sessions",
      "data": {
        "notes": "{{transcription}}",
        "peak_intensity": "{{extracted_intensity}}"
      }
    }
  ]
}
```

### 5. Shared Memory Workflow

**Purpose**: Maintain context between agents

```json
{
  "id": "shared-memory",
  "nodes": [
    {
      "type": "cron",
      "name": "Memory Cleanup",
      "expression": "0 */6 * * *",
      "comment": "Every 6 hours"
    },
    {
      "type": "supabase",
      "name": "Get Expired Memories",
      "operation": "select",
      "table": "agent_memory",
      "filter": "expires_at < NOW()"
    },
    {
      "type": "function",
      "name": "Categorize Memories",
      "code": `
        // Sort memories by importance
        const critical = memories.filter(m => m.type === 'medical');
        const preferences = memories.filter(m => m.type === 'preference');
        const temporary = memories.filter(m => m.type === 'joke');
        
        // Archive critical, update preferences, delete temporary
      `
    }
  ]
}
```

## Memory Types & Persistence

### Short-term Memory (24 hours)
- Jokes mentioned
- Mood indicators
- Recent topics
- Session-specific context

### Medium-term Memory (7 days)
- Recent concerns
- Temporary goals
- Session patterns
- Conversation threads

### Long-term Memory (Permanent)
- Medical considerations
- Core preferences
- Major milestones
- Risk factors

## Context Sharing Protocol

### Agent Handoff Example
```javascript
// Aria to Sage handoff
const handoffContext = {
  fromAgent: 'aria',
  toAgent: 'sage',
  userId: 'user123',
  reason: 'User asking about patterns',
  context: {
    recentTopics: ['dosage concerns', 'frequency'],
    userMood: 'curious',
    sessionContext: {
      justMentioned: 'feeling like taking too much',
      joke: 'coffee addiction comparison'
    }
  },
  timestamp: Date.now()
};

// Sage receives and acknowledges
"I see Aria mentioned you're curious about your patterns. 
And yes, kratom can be a bit like coffee - as you joked - 
but let's look at your actual data..."
```

## Integration Points

### 1. Supabase Realtime
```javascript
// Subscribe to agent memory updates
supabase
  .channel('agent-memory')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'agent_memory',
    filter: `user_id=eq.${userId}`
  }, handleMemoryUpdate)
  .subscribe();
```

### 2. Claude API Configuration
```javascript
const agentPrompts = {
  aria: {
    system: `You are Aria, a warm wellness navigator...
    Current user context: {context}
    Recent memories: {memories}`,
    temperature: 0.7
  },
  sage: {
    system: `You are Dr. Sage, analytical and precise...
    Session data: {sessions}
    User patterns: {patterns}`,
    temperature: 0.5
  },
  luna: {
    system: `You are Luna, calm and supportive...
    Current session: {session}
    Never interrupt, always gentle`,
    temperature: 0.8
  }
};
```

### 3. Voice Configuration
```javascript
const voiceConfig = {
  aria: {
    voiceId: 'EXAVITQu4vr4xnSDxMaL', // Warm female
    stability: 0.75,
    similarity: 0.85
  },
  sage: {
    voiceId: 'ErXwobahmNvHBvEkXQtL', // Professional
    stability: 0.85,
    similarity: 0.75
  },
  luna: {
    voiceId: 'MF3mGyEYCl7XgEiYwp1N', // Soft, calm
    stability: 0.90,
    similarity: 0.80
  }
};
```

## Monitoring & Analytics

### Key Metrics
- Agent response times
- Memory retrieval accuracy
- Context handoff success rate
- User satisfaction (implicit from continued use)
- Token usage per conversation

### Debug Dashboard
```javascript
// n8n webhook for monitoring
{
  activeWorkflows: ['aria', 'sage', 'luna'],
  memoryStats: {
    total: 1247,
    shortTerm: 89,
    mediumTerm: 234,
    longTerm: 924
  },
  recentHandoffs: [
    { from: 'aria', to: 'sage', success: true },
    { from: 'sage', to: 'luna', success: true }
  ],
  apiUsage: {
    claude: { tokens: 45678, cost: '$2.34' },
    elevenLabs: { characters: 12345, cost: '$1.23' }
  }
}
```

## Deployment Configuration

### Environment Variables
```env
# n8n Configuration
N8N_WEBHOOK_URL=https://your-n8n-instance.com
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=secure_password

# API Keys (stored in n8n)
ANTHROPIC_API_KEY=sk-ant-...
ELEVENLABS_API_KEY=...
OPENAI_API_KEY=sk-...

# Supabase
SUPABASE_SERVICE_KEY=...
```

### n8n Deployment
1. Self-hosted on VPS/Docker for full control
2. Use PostgreSQL for n8n data persistence
3. Configure Redis for queue management
4. Set up SSL with Let's Encrypt
5. Enable webhook authentication

## Benefits of n8n Orchestration

1. **Visual Workflow Design** - Easy to modify agent behaviors
2. **Error Handling** - Built-in retry logic and fallbacks
3. **Monitoring** - Real-time execution logs
4. **Scalability** - Queue management for high load
5. **Integration** - 400+ nodes for external services
6. **Version Control** - Export/import workflows as JSON
7. **Testing** - Test individual nodes before deployment
8. **Cost Optimization** - Cache responses, batch operations

## Future Enhancements

1. **Multi-modal Agents** - Image analysis for product photos
2. **Predictive Interventions** - Proactive support based on patterns
3. **Community Insights** - Anonymized aggregate learnings
4. **External Integrations** - Calendar, health apps, wearables
5. **Advanced Analytics** - ML models for personalization

This architecture creates a truly intelligent system where agents feel like a cohesive team with shared knowledge and seamless handoffs!