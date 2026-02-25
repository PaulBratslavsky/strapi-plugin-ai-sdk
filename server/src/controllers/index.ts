import controller from './controller';
import mcp from './mcp';
import conversation from './conversation';
import memory from './memory';
import publicMemory from './public-memory';

export default {
  controller,
  mcp,
  conversation,
  memory,
  'public-memory': publicMemory,
};
