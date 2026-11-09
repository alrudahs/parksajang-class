/*
 * 자동 시험에서 GA4 로 데이터가 나가지 않게 막는다. (CLAUDE.md 12장)
 *
 * 2026-11-09 route 차단만으로는 페이지를 떠날 때 나가는 요청 등이 새어 GA4 에 기록되었다.
 * 그래서 두 겹으로 막는다.
 *   1) 브라우저를 켤 때 GA 수집 주소를 찾을 수 없게 한다 (launchOptions)
 *   2) context.route 로 수집 요청을 중단한다 (blockAnalytics)
 */
const COLLECT_HOSTS = [
  '*.google-analytics.com',
  'google-analytics.com',
  'analytics.google.com',
  'stats.g.doubleclick.net',
];

const COLLECT_URL = /^https?:\/\/([a-z0-9-]+\.)*(google-analytics\.com|analytics\.google\.com|stats\.g\.doubleclick\.net)\//i;

function launchOptions(options = {}) {
  const rules = COLLECT_HOSTS.map((host) => `MAP ${host} ~NOTFOUND`).join(', ');
  return { ...options, args: [...(options.args || []), `--host-resolver-rules=${rules}`] };
}

async function blockAnalytics(context) {
  await context.route(COLLECT_URL, (route) => route.abort());
}

module.exports = { COLLECT_URL, launchOptions, blockAnalytics };
