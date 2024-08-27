// src/api/symptom-checker/symptom-checker.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSymptomCheckerDto } from './dto/create-symptom-checker.dto';
import { UpdateSymptomCheckerDto } from './dto/update-symptom-checker.dto';
import axios from 'axios';

@Injectable()
export class SymptomCheckerService {
  private readonly apiUrl = 'http://api.endlessmedical.com/v1/dx';

  constructor(private readonly prisma: PrismaService) {}

  // Initialize a session and return the SessionID
  private async initSession(): Promise<string> {
    const response = await axios.get(`${this.apiUrl}/InitSession`);
    return response.data.SessionID;
  }

  // Accept the Terms of Use for the session
  private async acceptTermsOfUse(sessionId: string): Promise<void> {
    const passphrase = 'I have read, understood and I accept and agree to comply with the Terms of Use of EndlessMedicalAPI and Endless Medical services. The Terms of Use are available on endlessmedical.com';
    await axios.post(`${this.apiUrl}/AcceptTermsOfUse?SessionID=${sessionId}&passphrase=${encodeURIComponent(passphrase)}`);
  }

  async create(createSymptomCheckerDto: CreateSymptomCheckerDto) {
    try {
      const sessionId = await this.initSession();
      console.log('Session initialized:', sessionId);
      
      await this.acceptTermsOfUse(sessionId);
      console.log('Terms of use accepted for session:', sessionId);
  
      for (const symptom of createSymptomCheckerDto.symptoms) {
        console.log(`Updating symptom: ${symptom}`);
        await axios.post(`${this.apiUrl}/UpdateFeature?SessionID=${sessionId}&name=${encodeURIComponent(symptom)}&value=1`);
      }
  
      console.log('Analyzing symptoms...');
      const analysisResponse = await axios.get(`${this.apiUrl}/Analyze?SessionID=${sessionId}`);
      const diagnosis = analysisResponse.data.Diseases;
      const diagnosisString = diagnosis.map(d => Object.keys(d)[0]).join(', ');
  
      const result = await this.prisma.symptomChecker.create({
        data: {
          ...createSymptomCheckerDto,
          diagnosis: diagnosisString,
        },
      });
  
      return result;
    } catch (error) {
      console.error('Error occurred during symptom checker creation:', error.message, error.response?.data);
      throw error;
    }
  }
  

  async findAll() {
    return this.prisma.symptomChecker.findMany();
  }

  async findOne(id: string) {
    const symptomChecker = await this.prisma.symptomChecker.findUnique({
      where: { id },
    });
    if (!symptomChecker) {
      throw new NotFoundException(`SymptomChecker with ID ${id} not found`);
    }
    return symptomChecker;
  }

  async update(id: string, updateSymptomCheckerDto: UpdateSymptomCheckerDto) {
    const { userId, recommendedDoctorId, ...rest } = updateSymptomCheckerDto;

    return this.prisma.symptomChecker.update({
      where: { id },
      data: rest,
    });
  }

  async remove(id: string) {
    return this.prisma.symptomChecker.delete({
      where: { id },
    });
  }
}
