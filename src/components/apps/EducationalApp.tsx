
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, GraduationCap, Trophy, PlayCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const EducationalApp = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Educational Hub</h2>
        <Button className="bg-ocean-600 hover:bg-ocean-700">
          <GraduationCap className="mr-2 h-4 w-4" /> My Learning
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Courses Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">3</div>
              <div className="ml-1 text-lg">/ 12</div>
              <Trophy className="ml-auto h-5 w-5 text-karbon-600" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Your learning progress
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">24</div>
              <BookOpen className="ml-auto h-5 w-5 text-ocean-600" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Educational resources
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Community Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">3,521</div>
              <GraduationCap className="ml-auto h-5 w-5 text-karbon-600" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Learning together
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Featured Courses</CardTitle>
              <CardDescription>Learn about carbon markets and sustainability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: 'Introduction to Carbon Markets', level: 'Beginner', duration: '2 hours', modules: 5 },
                  { title: 'Carbon Project Development', level: 'Intermediate', duration: '4 hours', modules: 8 },
                  { title: 'Blockchain for Carbon Credits', level: 'Advanced', duration: '3 hours', modules: 6 },
                  { title: 'Carbon Footprint Calculation', level: 'Beginner', duration: '1.5 hours', modules: 4 }
                ].map((course, i) => (
                  <div key={i} className="flex border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="w-24 bg-gradient-to-b from-karbon-100 to-ocean-100 dark:from-karbon-900 dark:to-ocean-900 flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-karbon-600" />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{course.title}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Level: {course.level} • {course.modules} modules
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{course.duration}</span>
                        </div>
                      </div>
                      <div className="flex justify-end mt-3">
                        <Button className="bg-karbon-600 hover:bg-karbon-700">
                          <PlayCircle className="mr-2 h-4 w-4" /> Start Course
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Community Challenges</CardTitle>
              <CardDescription>Participate and earn rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: '30-Day Carbon Diet', participants: 245, days: 12 },
                  { title: 'Tree Planting Initiative', participants: 178, days: 5 },
                  { title: 'Zero Waste Challenge', participants: 320, days: 20 }
                ].map((challenge, i) => (
                  <div key={i} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="font-medium mb-2">{challenge.title}</div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <span>{challenge.participants} participants</span>
                      <span>Ends in {challenge.days} days</span>
                    </div>
                    <Button variant="outline" className="w-full">
                      Join Challenge
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EducationalApp;
