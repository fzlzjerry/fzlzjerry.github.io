export const assignments = [
  {
    id: 'competition-rules',
    title: 'Assignment 1: iGEM Competition Rules',
    date: 'December 15th, 2024',
    author: 'Morax Cheng',
    description: 'Comprehensive overview of iGEM 2025 competition rules and requirements',
    sections: [
      {
        title: 'Competition Overview',
        items: [
          { text: 'Teams must register and be approved by iGEM HQ', icon: 'users' },
          { text: 'Hybrid format: Both in-person and remote participation available', icon: 'globe' },
          { text: 'Grand Jamboree: October 28-31, 2025 in Paris', icon: 'calendar-check' },
          { text: 'Safety and ethics compliance required', icon: 'shield-alt' }
        ]
      },
      {
        title: 'Required Deliverables',
        items: [
          { text: 'Safety Forms', icon: 'shield-alt' },
          { text: 'Judging Form', icon: 'gavel' },
          { text: 'Attribution Form', icon: 'clipboard-check' },
          { text: 'Promotion & Presentation Videos', icon: 'video' },
          { text: 'Project Description', icon: 'file-alt' },
          { text: 'Team Wiki', icon: 'globe' },
          { text: 'Part Pages', icon: 'puzzle-piece' },
          { text: 'Project Software', icon: 'code' },
          { text: 'Team Roster', icon: 'users' },
          { text: 'Judging Session', icon: 'comments' },
          { text: 'Project Presentation', icon: 'chalkboard-teacher' }
        ]
      },
      {
        title: 'Awards Structure',
        subsections: {
          medals: {
            title: 'Medal Criteria',
            items: [
              { level: 'Bronze', criteria: 'Complete project presentation and documentation' },
              { level: 'Silver', criteria: 'Engineering success and human practices' },
              { level: 'Gold', criteria: 'Excellence in specialized areas' }
            ]
          },
          village: {
            title: 'Village Awards',
            description: 'Special recognition for social contributions aligned with UN Sustainable Development Goals'
          },
          specialPrizes: {
            title: 'Special Prizes',
            items: [
              { name: 'Education & Inspiration', icon: 'graduation-cap' },
              { name: 'Entrepreneurship', icon: 'business-time' },
              { name: 'Hardware Excellence', icon: 'tools' },
              { name: 'Inclusivity', icon: 'users' },
              { name: 'Human Practices', icon: 'heart' },
              { name: 'Measurement Accuracy', icon: 'chart-line' },
              { name: 'Plant Synthetic Biology', icon: 'leaf' },
              { name: 'Safety & Security', icon: 'shield-alt' },
              { name: 'Software Tools', icon: 'code' },
              { name: 'Sustainable Development', icon: 'globe' },
              { name: 'Wiki Excellence', icon: 'file-code' }
            ]
          }
        }
      },
      {
        title: 'Important Notes',
        items: [
          { text: 'Only static URLs are accepted for documentation', icon: 'link' },
          { text: 'Teams must be multidisciplinary', icon: 'users-cog' },
          { text: 'All progress must be openly shared', icon: 'share-alt' },
          { text: 'Proper attribution required for all work', icon: 'certificate' }
        ]
      }
    ]
  }
];