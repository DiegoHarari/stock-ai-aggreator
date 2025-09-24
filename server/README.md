Server notes:

- The provider implementations in src/providers.ts are templates. They return mock results if API keys are not set.
- To call real APIs:
  - Set OPENAI_API_KEY, ANTHROPIC_API_KEY or GOOGLE_API_KEY in server/.env
  - Replace the mocked request blocks with actual HTTP calls following each provider's docs.
