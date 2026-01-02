<template>
  <div class="min-h-screen bg-white">
    <!-- Header Section -->
    <div class="bg-white">
      <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-24 pb-8">
        <!-- Main Title -->
        <div class="mb-4">
          <h1 class="text-7xl font-semibold text-gray-900 tracking-wider">About Us</h1>
        </div>
        
        <!-- Description and EduNinja -->
        <div class="flex justify-between items-center mb-4">
          <p class="text-gray-600 text-lg">
            Building more than just a study tool—we're building a student's second brain.
          </p>
          <h2 class="text-2xl font-bold text-gray-900 ml-8">EduNinja</h2>
        </div>
        
        <!-- Full width divider line -->
        <div class="w-full h-0.5 bg-gray-900"></div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
      <div class="max-w-4xl">
        <!-- Mission Statement -->
        <div class="mb-16">
          <p class="text-lg text-gray-600 leading-relaxed mb-8">
            Traditional learning hasn't kept up with the pace of technology. Students are still overwhelmed by scattered textbooks, monotonous assignments, and rigid systems that don't adapt to their needs. We believe studying shouldn't feel like a burden.
          </p>
        </div>

        <!-- Features Section -->
        <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">EduNinja brings everything together in one place:</h3>
          <div class="space-y-3 text-lg text-gray-700">
            <p>📘 A growing library of user-contributed notes and past papers</p>
            <p>🤖 Smart AI tools that help you search, solve, and understand</p>
            <p>📝 Custom flashcards and study notes that adapt to how you learn</p>
            <p>📄 Exam paper generators to practice the way exams actually test you</p>
          </div>
        </div>

        <p class="text-lg text-gray-600 leading-relaxed mb-12">
          <strong>We are here to make studying less painful, more engaging, and ultimately more effective.</strong>
        </p>

        <!-- Our Team Section -->
        <div class="mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-8">Our Team</h2>
          <div class="space-y-6">
            <p class="text-lg text-gray-700 leading-relaxed">
              We're a team of curious, creative minds from leading universities like Cambridge and Stanford—united by a single belief: technology should empower the way we learn.
            </p>
            
            <p class="text-lg text-gray-700 leading-relaxed">
              We've been through the late nights, the exam stress, and the endless materials ourselves. Instead of accepting that as the norm, we set out to rethink the entire experience.
            </p>
            
            <p class="text-lg text-gray-700 leading-relaxed">
              At EduNinja, we're creating something different—an education platform that feels dynamic, engaging, and built for today's students. We believe studying can spark ideas, fuel creativity, and even bring joy.
            </p>
            
            <p class="text-lg text-gray-700 leading-relaxed">
              We're not here to follow the old playbook. We're here to write a new one. 🚀
            </p>
            
            <div class="pt-4">
              <button class="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                <span class="flex items-center space-x-2">
                  <span>Work with us</span>
                  <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToApp = () => {
  // Simulate login and navigate to app
  localStorage.setItem('token', 'demo-auth-token')
  router.push('/library')
}
</script>

<style scoped>
/* Additional custom styles if needed */
.prose {
  max-width: none;
}

.prose p {
  margin-bottom: 1.5rem;
}

.prose h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}
</style>
